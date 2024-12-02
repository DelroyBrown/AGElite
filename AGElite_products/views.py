from django.shortcuts import render

# TO BE CHANGED TO A PROPER PRODUCTS PAGE WHEN WE START ADDING PRODUCTS
def store_page(request):
    return render(request, 'store/store.html')

# TO BE CHANGED TO A PROPER PRODUCT DETAIL PAGE WHEN WE START ADDING PRODUCTS
def product_detail(request):
    return render(request, 'store/product_detail.html')