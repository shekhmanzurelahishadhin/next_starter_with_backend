<?php
namespace App\Http\Controllers\api\sales;

use App\Http\Controllers\Controller;
use App\Http\Requests\sales\customerContact\CustomersContactRequest;
use App\Models\softConfig\CustomersContact;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;

class CustomersContactController extends Controller
{
    public function index()
    {
        $data = CustomersContact::latest()->paginate(10);
        return ApiResponse::success($data, 'Customer contacts list');
    }

    public function store(CustomersContactRequest $request)
    {
        $contact = CustomersContact::create(
            array_merge($request->validated(), [
                'created_by' => auth()->id()
            ])
        );

        return ApiResponse::success($contact, 'Customer contact created', 201);
    }

    public function show($id)
    {
        $contact = CustomersContact::find($id);

        if (!$contact) {
            return ApiResponse::notFound('Customer contact not found');
        }

        return ApiResponse::success($contact, 'Customer contact details');
    }

    public function update(CustomersContactRequest $request, $id)
    {
        $contact = CustomersContact::find($id);

        if (!$contact) {
            return ApiResponse::notFound('Customer contact not found');
        }

        $contact->update(
            array_merge($request->validated(), [
                'updated_by' => auth()->id()
            ])
        );

        return ApiResponse::success($contact, 'Customer contact updated');
    }

    public function destroy($id)
    {
        $contact = CustomersContact::find($id);

        if (!$contact) {
            return ApiResponse::notFound('Customer contact not found');
        }

        $contact->update([
            'deleted_by' => auth()->id()
        ]);

        $contact->delete();

        return ApiResponse::success([], 'Customer contact deleted');
    }
}
