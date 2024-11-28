from django.shortcuts import render

def store_page(request):
    return render(request, 'store/store.html')