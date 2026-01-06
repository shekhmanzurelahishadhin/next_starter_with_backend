<?php
namespace App\Models\softConfig;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomersContact extends Model
{
    use SoftDeletes;

    protected $table = 'customers_contact';

    protected $fillable = [
        'district',
        'company_id',
        'customer_name',
        'contact_one',
        'contact_two',
        'contact_three',
        'remarks',
        'created_by',
        'updated_by',
        'deleted_by',
    ];
}
