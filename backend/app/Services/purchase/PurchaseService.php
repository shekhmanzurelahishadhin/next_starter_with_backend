<?php

namespace App\Services\purchase;

use App\Repositories\Interfaces\PurchaseRepositoryInterface;
use App\Repositories\Interfaces\PurchaseDetailRepositoryInterface;
use App\Services\softConfig\CompanyService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PurchaseService
{
    protected $purchaseRepository;
    protected $purchaseDetailRepository;
    protected $companyService;

    public function __construct(
        PurchaseRepositoryInterface $purchaseRepository,
        PurchaseDetailRepositoryInterface $purchaseDetailRepository,
        CompanyService $companyService
    ) {
        $this->purchaseRepository = $purchaseRepository;
        $this->purchaseDetailRepository = $purchaseDetailRepository;
        $this->companyService = $companyService;
    }

    /**
     * Get all purchases with pagination
     */
    public function getAllPurchases(int $perPage = 15, array $relations = [], array $filters = [])
    {
        return $this->purchaseRepository->paginate($perPage, $relations, $filters);
    }

    /**
     * Get purchase by ID
     */
    public function getPurchaseById(int $id, array $relations = [])
    {
        return $this->purchaseRepository->find($id, $relations);
    }

    /**
     * Delete purchase
     */
    public function deletePurchase(int $id): bool
    {
        return $this->purchaseRepository->delete($id);
    }

    /**
     * Create purchase with auto-generated numbers
     */
    public function createPurchaseWithNumbers(array $purchaseData, array $detailsData = [])
    {
        return DB::transaction(function () use ($purchaseData, $detailsData) {
            // Step 1: Validate that company_id is provided
            if (!isset($purchaseData['company_id'])) {
                throw new \Exception("company_id is required");
            }

            // Step 2: Validate company exists
            $company = $this->companyRepository->find($purchaseData['company_id']);
            if (!$company) {
                throw new \Exception("Company not found with ID: {$purchaseData['company_id']}");
            }

            // Step 3: Generate serial numbers
            $maxSlNo = $this->purchaseRepository->getNextMaxSlNo();
            $companySlNo = $this->purchaseRepository->getNextCompanySlNo($purchaseData['company_id']);
            $poNo = $this->purchaseRepository->generatePoNo($purchaseData['company_id'], $companySlNo);

            // Step 4: Merge generated numbers with purchase data
            $purchaseData['max_sl_no'] = $maxSlNo;
            $purchaseData['company_sl_no'] = $companySlNo;
            $purchaseData['po_no'] = $poNo;

            // Step 5: Create purchase
            $purchase = $this->purchaseRepository->create($purchaseData);

            // Step 6: Create purchase details if any
            if (!empty($detailsData)) {
                $this->createPurchaseDetails($purchase->id, $detailsData);
            }

            return $purchase->fresh(['details', 'company', 'supplier']);
        });
    }

    /**
     * Preview next purchase numbers for a company
     */
    public function previewNextNumbers(int $companyId): array
    {
        try {
            $company = $this->companyRepository->find($companyId);

            if (!$company) {
                throw new \Exception("Company not found with ID: {$companyId}");
            }

            $maxSlNo = $this->purchaseRepository->getNextMaxSlNo();
            $companySlNo = $this->purchaseRepository->getNextCompanySlNo($companyId);
            $poNo = $this->purchaseRepository->generatePoNo($companyId, $companySlNo);

            return [
                'max_sl_no' => $maxSlNo,
                'company_sl_no' => $companySlNo,
                'po_no' => $poNo,
                'company_id' => $companyId,
                'company_name' => $company->name,
                'company_code' => $company->code
            ];
        } catch (\Exception $e) {
            Log::error("Error previewing next numbers: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Create purchase details
     */
    private function createPurchaseDetails(int $purchaseId, array $detailsData): void
    {
        $details = [];
        $createdBy = auth()->id();

        foreach ($detailsData as $detail) {
            $details[] = array_merge($detail, [
                'purchase_id' => $purchaseId,
                'created_by' => $createdBy,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        $this->purchaseDetailRepository->createMany($details);
    }

    /**
     * Update purchase (preserve auto-generated numbers)
     */
    public function updatePurchase(int $purchaseId, array $purchaseData, array $detailsData = [])
    {
        return DB::transaction(function () use ($purchaseId, $purchaseData, $detailsData) {
            // Get existing purchase
            $purchase = $this->purchaseRepository->find($purchaseId);

            if (!$purchase) {
                throw new \Exception("Purchase not found");
            }

            // Preserve auto-generated fields
            $protectedFields = ['max_sl_no', 'company_sl_no', 'po_no', 'company_id'];
            foreach ($protectedFields as $field) {
                unset($purchaseData[$field]);
            }

            // Set updated_by
            $purchaseData['updated_by'] = auth()->id();

            // Update purchase
            $this->purchaseRepository->update($purchaseId, $purchaseData);

            // Update details if provided
            if (!empty($detailsData)) {
                $this->purchaseDetailRepository->deleteByPurchaseId($purchaseId);
                $this->createPurchaseDetails($purchaseId, $detailsData);
            }

            return $this->purchaseRepository->find($purchaseId, ['details', 'company', 'supplier']);
        });
    }

    /**
     * Get purchases by company with pagination
     */
    public function getPurchasesByCompany(int $companyId, array $filters = [], int $perPage = 15)
    {
        $filters['company_id'] = $companyId;
        return $this->purchaseRepository->paginate($perPage, ['details', 'supplier'], $filters);
    }

    /**
     * Get purchase statistics
     */
    public function getPurchaseStatistics(array $filters = []): array
    {
        // You need to add these methods to your PurchaseRepositoryInterface and implementation
        $totalPurchases = $this->purchaseRepository->getTotalPurchases($filters);
        $totalDue = $this->purchaseRepository->getTotalDue($filters);

        return [
            'total_purchases' => $totalPurchases,
            'total_due' => $totalDue,
            'total_paid' => $totalPurchases - $totalDue,
        ];
    }

    /**
     * Get company purchase statistics
     */
    public function getCompanyPurchaseStats(int $companyId): array
    {
        return $this->purchaseRepository->getCompanyPurchaseStats($companyId);
    }

    /**
     * Approve purchase
     */
    public function approvePurchase(int $id): bool
    {
        return $this->purchaseRepository->update($id, ['status' => 1]);
    }

    /**
     * DEPRECATED: Old method kept for backward compatibility
     */
    public function createPurchaseWithDetails(array $purchaseData, array $detailsData)
    {
        // Call the new method
        return $this->createPurchaseWithNumbers($purchaseData, $detailsData);
    }

    /**
     * DEPRECATED: Old method kept for backward compatibility
     */
    public function updatePurchaseWithDetails(int $purchaseId, array $purchaseData, array $detailsData)
    {
        // Call the new method
        return $this->updatePurchase($purchaseId, $purchaseData, $detailsData);
    }
}
