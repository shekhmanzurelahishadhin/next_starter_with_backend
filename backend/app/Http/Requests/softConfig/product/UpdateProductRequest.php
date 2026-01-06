<?php

namespace App\Http\Requests\softConfig\product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $productId = $this->route('product'); // assuming route like /products/{product}

        return [
            'product_category_id' => 'required|exists:categories,id',
            'sub_category_id'     => 'nullable|exists:sub_categories,id',
            'brand_id'            => 'required|exists:brands,id',
            'unit_id'             => 'nullable|exists:units,id',
            'company_id'          => 'nullable|exists:companies,id',
            'vehicle_brand_id'    => 'nullable|exists:vehicle_brands,id',
            //'country_id'          => 'nullable|exists:countries,id',
            'name'                => 'required|string|max:255',
            'part_number'         => ['nullable', 'string', 'max:100', Rule::unique('products')->ignore($productId)],
            'alert_qty'           => 'nullable|integer|min:0',
            'short_list_qty'      => 'nullable|numeric|min:0',
            'unit_weight'         => 'nullable|string|max:100',
            'model'               => 'nullable|string|max:255',
            'model_year'          => 'nullable|string|max:50',
            'engine'              => 'nullable|string|max:255',
            'chassis'             => 'nullable|string|max:255',
            'status'              => 'nullable|in:0,1',
        ];
    }

    /**
     * Custom messages for validation.
     */
    public function messages(): array
    {
        return [
            'product_category_id.*' => 'Please select a valid category.',
            'brand_id.*'            => 'Please select a valid brand.',
            'name.required'         => 'Product name is required.',
            'part_number.unique'    => 'This part number is already in use.',
        ];
    }
}
