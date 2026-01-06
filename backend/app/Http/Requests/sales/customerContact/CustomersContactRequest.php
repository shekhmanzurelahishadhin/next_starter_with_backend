<?php
namespace App\Http\Requests\sales\customerContact;

use Illuminate\Foundation\Http\FormRequest;

class CustomersContactRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'district'        => 'required|string|max:255',
            'company_id'      => 'required|integer',
            'customer_name'   => 'required|string|max:255',
            'contact_one'     => 'required|string|max:20',
            'contact_two'     => 'nullable|string|max:20',
            'contact_three'   => 'nullable|string|max:20',
            'remarks'         => 'nullable|string',
        ];
    }
}
