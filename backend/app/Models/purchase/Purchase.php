<?php

namespace App\Models\purchase;
use App\Models\softConfig\Company;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Purchase extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'po_no',
        'max_sl_no',
        'company_sl_no',
        'purchase_date',
        'cash_due',
        'purchase_type',
        'company_id',
        'store_id',
        'ship_by',
        'supplier_id',
        'payment_type',
        'payment_amount',
        'supplier_bill_no',
        'grand_total',
        'due_amount',
        'status',
        'full_paid',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'payment_amount' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'due_amount' => 'decimal:2',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(PurchaseDetail::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
