<?php

namespace App\Services\softConfig;

use App\Models\softConfig\Product;

class ProductService
{
    public function getProducts(array $filters = [], $perPage = null, $categoryId = null, $subCategoryId = null, $brandId = null)
    {
        $query = Product::query()->select(
            'id',
            'name',
            'part_number',
            'brand_id',
            'product_category_id',
            'sub_category_id',
            'unit_id',
            'alert_qty',
            'short_list_qty',
            'unit_weight',
            'model',
            'model_year',
            'engine',
            'chassis',
            'status',
            'created_by',
            'created_at',
            'deleted_at'
        );

        // Direct filters
        if ($categoryId) {
            $query->where('product_category_id', $categoryId);
        }

        if ($subCategoryId) {
            $query->where('sub_category_id', $subCategoryId);
        }

        if ($brandId) {
            $query->where('brand_id', $brandId);
        }

        // Trash / status handling
        if (($filters['status'] ?? '') === 'trash') {
            $query->onlyTrashed();
        } elseif (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        } else {
            $query->withTrashed();
        }

        // Dynamic filters
        $query
            ->when($filters['name'] ?? null, fn($q, $v) =>
            $q->where('name', 'like', "%{$v}%")
            )
            ->when($filters['part_number'] ?? null, fn($q, $v) =>
            $q->where('part_number', 'like', "%{$v}%")
            )
            ->when($filters['alert_qty'] ?? null, fn($q, $v) =>
            $q->where('alert_qty', $v)
            )
            ->when($filters['model'] ?? null, fn($q, $v) =>
            $q->where('model', 'like', "%{$v}%")
            )
            ->when($filters['created_by'] ?? null, fn($q, $v) =>
            $q->whereHas('createdBy', fn($u) =>
            $u->where('name', 'like', "%{$v}%")
            )
            )
            ->when($filters['category_name'] ?? null, fn($q, $v) =>
            $q->whereHas('category', fn($c) =>
            $c->where('name', 'like', "%{$v}%")
            )
            )
            ->when($filters['sub_category_name'] ?? null, fn($q, $v) =>
            $q->whereHas('subCategory', fn($s) =>
            $s->where('name', 'like', "%{$v}%")
            )
            )
            ->when($filters['brand_name'] ?? null, fn($q, $v) =>
            $q->whereHas('brand', fn($b) =>
            $b->where('name', 'like', "%{$v}%")
            )
            )
            ->when($filters['search'] ?? null, fn($q, $term) =>
            $q->where(function ($sub) use ($term) {
                $sub->where('name', 'like', "%{$term}%")
                    ->orWhere('part_number', 'like', "%{$term}%")
                    ->orWhere('model', 'like', "%{$term}%")
                    ->orWhereHas('category', fn($c) => $c->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('brand', fn($b) => $b->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('createdBy', fn($u) => $u->where('name', 'like', "%{$term}%"));
            })
            );

        // Eager loading
        $query->with([
            'createdBy:id,name',
            'category:id,name',
            'subCategory:id,name',
            'brand:id,name',
            'unit:id,name',
        ])->orderByDesc('id');

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function createProduct(array $data)
    {
        return Product::create($data);
    }

    public function updateProduct(Product $product, array $data)
    {
        $product->update($data);
        return $product;
    }

    public function softDeleteProduct(Product $product)
    {
        return $product->delete();
    }

    public function restoreProduct(Product $product)
    {
        if ($product->trashed()) {
            $product->restore();
        }
        return $product;
    }

    public function forceDeleteProduct(Product $product)
    {
        if ($product->trashed()) {
            $product->forceDelete();
            return true;
        }
        return false;
    }
}
