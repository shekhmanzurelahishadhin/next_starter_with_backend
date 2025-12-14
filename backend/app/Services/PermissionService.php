<?php


namespace App\Services;


use App\Models\authorization\PermissionModel;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function getPermission(array $filters, $perPage = null)
    {
        $query = PermissionModel::query();

        $query
            ->when($filters['name'] ?? null, fn ($q, $name) =>
            $q->where('name', 'like', "%{$name}%")
            )

            ->when($filters['module_name'] ?? null, fn ($q, $moduleName) =>
            $q->whereHas('module', fn ($m) =>
            $m->where('name', 'like', "%{$moduleName}%")
            )
            )

            ->when($filters['menu_name'] ?? null, fn ($q, $menuName) =>
            $q->whereHas('menu', fn ($m) =>
            $m->where('name', 'like', "%{$menuName}%")
            )
            )

            ->when($filters['sub_menu_name'] ?? null, fn ($q, $subMenuName) =>
            $q->whereHas('subMenu', fn ($sm) =>
            $sm->where('name', 'like', "%{$subMenuName}%")
            )
            )

            ->when($filters['created_at'] ?? null, fn ($q, $date) =>
            $q->whereDate('created_at', date('Y-m-d', strtotime($date)))
            )

            ->when($filters['updated_at'] ?? null, fn ($q, $date) =>
            $q->whereDate('updated_at', date('Y-m-d', strtotime($date)))
            )

            ->when($filters['search'] ?? null, fn ($q, $term) =>
            $q->where(function ($sub) use ($term) {
                $sub->where('name', 'like', "%{$term}%")
                    ->orWhereHas('module', fn ($m) =>
                    $m->where('name', 'like', "%{$term}%")
                    )
                    ->orWhereHas('menu', fn ($m) =>
                    $m->where('name', 'like', "%{$term}%")
                    )
                    ->orWhereHas('subMenu', fn ($sm) =>
                    $sm->where('name', 'like', "%{$term}%")
                    );
            })
            );

        $query->with([
            'module:id,name',
            'menu:id,name',
            'subMenu:id,name'
        ])->orderBy('id', 'desc');

        return $perPage ? $query->paginate($perPage) : $query->get();
    }


    public function createPermission(array $data)
    {
        // Force guard_name to 'web' if not provided
        $data['guard_name'] = 'web';

        return Permission::create($data);
    }

    public function updatePermission($permission, $data)
    {

        $data = collect($data)->except(['created_at'])->toArray();

        $permission->update($data);

        return $permission;
    }
    public function deletePermission($permission)
    {
        return $permission->delete();
    }
}
