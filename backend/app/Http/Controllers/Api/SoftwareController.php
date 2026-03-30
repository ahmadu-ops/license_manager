<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSoftwareRequest;
use App\Models\Software;
use Illuminate\Http\JsonResponse;

class SoftwareController extends Controller
{
    public function index(): JsonResponse
    {
        $softwares = Software::withCount('licenses')
            ->orderBy('name')
            ->get();

        return response()->json($softwares);
    }

    public function store(StoreSoftwareRequest $request): JsonResponse
    {
        $software = Software::create([
            ...$request->validated(),
            'logo_url' => null,
        ]);

        return response()->json($software, 201);
    }

    public function show(Software $software): JsonResponse
    {
        $software->loadCount('licenses');

        return response()->json($software);
    }

    public function update(StoreSoftwareRequest $request, Software $software): JsonResponse
    {
        $software->update($request->validated());

        return response()->json($software);
    }

    public function destroy(Software $software): JsonResponse
    {
        if ($software->licenses()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer : ce logiciel a des licences associées.',
            ], 422);
        }

        $software->delete();

        return response()->json(['message' => 'Logiciel supprimé.']);
    }
}