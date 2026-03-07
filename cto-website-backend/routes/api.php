<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InventoryDashboardController;
use App\Http\Controllers\ITServiceRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequestDashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\GuidelineController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::post('/submit-request', [ITServiceRequestController::class, 'store']);
  Route::post('/submit-inventory', [InventoryController::class, 'store']);
  Route::post('/publish-news', [NewsController::class, 'store']);
  Route::post('/guideline/upload', [GuidelineController::class, 'upload']);
  Route::get('/it-service-request', [ITServiceRequestController::class, 'index']);
  Route::get('/it-service-request/my', [ITServiceRequestController::class, 'myRequests']);

  Route::get('/dashboard/request-summary', [RequestDashboardController::class, 'requestSummary']);
  Route::get('/dashboard/request-summary/my', [RequestDashboardController::class, 'myRequestSummary']);

  Route::get('/dashboard/request-category', [RequestDashboardController::class, 'requestByCategory']);
  Route::get('/dashboard/request-month', [RequestDashboardController::class, 'requestPerMonth']);

  Route::get('/dashboard/request-category/my', [RequestDashboardController::class, 'myRequestByCategory']);
  Route::get('/dashboard/request-month/my', [RequestDashboardController::class, 'myRequestPerMonth']);

  Route::post('/profile/update', [ProfileController::class, 'update']);
  Route::get('/profile', [ProfileController::class, 'show']);
});

Route::post('/register', [AuthController::class, 'register']);

Route::get('/dashboard/inventory-category', [InventoryDashboardController::class, 'inventoryByCategory']);
Route::get('/dashboard/inventory-month', [InventoryDashboardController::class, 'inventoryPerMonth']);

Route::get('/guideline/list', [GuidelineController::class, 'list']);
Route::get('/guideline/{id}/view', [GuidelineController::class, 'view']);
Route::delete('/guideline/{id}/delete', [GuidelineController::class, 'destroy']);

Route::put('/it-service-request/{id}/status', [ITServiceRequestController::class, 'updateStatus']);
Route::put('/it-service-request/{id}/approve', [ITServiceRequestController::class, 'approve']);
Route::put('/it-service-request/{id}/reject', [ITServiceRequestController::class, 'reject']);
Route::put('/it-service-request/{id}/done', [ITServiceRequestController::class, 'done']);
Route::delete('/it-service-request/{id}', [ITServiceRequestController::class, 'destroy']);

Route::get('/inventory', [InventoryController::class, 'index']);
Route::put('/inventory/{id}', [InventoryController::class, 'update']);
Route::get('/inventory/{id}', [InventoryController::class, 'show']);
Route::delete('/inventory/{id}', [InventoryController::class, 'destroy']);

Route::get('/news', [NewsController::class, 'index']);
Route::put('/news/{slug}', [NewsController::class, 'update']);
Route::post('news/increment-views/{slug}', [NewsController::class, 'incrementViews']);
Route::get('/news/{slug}', [NewsController::class, 'show']);
Route::delete('/news/{slug}', [NewsController::class, 'destroy']);

