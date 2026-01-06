<?php

namespace App\Http\Controllers\api\purchase;

use App\Http\Controllers\Controller;
use App\Http\Requests\purchase\PurchaseRequest;
use App\Http\Resources\purchase\PurchaseResource;
use App\Repositories\Interfaces\PurchaseRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    private PurchaseRepositoryInterface $purchaseRepository;

    public function __construct(PurchaseRepositoryInterface $purchaseRepository)
    {
        $this->purchaseRepository = $purchaseRepository;
    }

    public function index(Request $request): JsonResponse
    {
        $purchases = $this->purchaseRepository->all($request->all());
        return response()->json([
            'success' => true,
            'data' => PurchaseResource::collection($purchases),
            'meta' => [
                'current_page' => $purchases->currentPage(),
                'total_pages' => $purchases->lastPage(),
                'total_items' => $purchases->total(),
                'per_page' => $purchases->perPage(),
            ]
        ]);
    }

    public function store(PurchaseRequest $request): JsonResponse
    {
        try {
            $purchase = $this->purchaseRepository->create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Purchase created successfully',
                'data' => new PurchaseResource($purchase)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create purchase',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $purchase = $this->purchaseRepository->find($id);

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'Purchase not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new PurchaseResource($purchase)
        ]);
    }

    public function update(PurchaseRequest $request, int $id): JsonResponse
    {
        try {
            $purchase = $this->purchaseRepository->update($id, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Purchase updated successfully',
                'data' => new PurchaseResource($purchase)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update purchase',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->purchaseRepository->delete($id);

            return response()->json([
                'success' => true,
                'message' => 'Purchase deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete purchase',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function generatePoNumber(Request $request): JsonResponse
    {
        $request->validate([
            'company_id' => 'required|integer|exists:companies,id'
        ]);

        $poNo = $this->purchaseRepository->generatePoNo($request->company_id);

        return response()->json([
            'success' => true,
            'data' => ['po_no' => $poNo]
        ]);
    }
}
