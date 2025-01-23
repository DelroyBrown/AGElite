from django.db import models




class ProductCategories(models.Model):
    category_name = models.CharField(max_length=100, blank=False, null=False)

    def __str__(self):
        return self.category_name
    

class ProductSize(models.Model):
    size_name = models.CharField(max_length=10, blank=False, null=False, default='')

    def __str__(self):
        return self.size_name
    

class Products(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(max_length=1000, blank=False, null=False, default='')
    image_1 = models.ImageField(upload_to='product-images', blank=False, null=False)
    image_2 = models.ImageField(upload_to='product-images', blank=True, null=True)
    image_3 = models.ImageField(upload_to='product-images', blank=True, null=True)
    size = models.CharField(max_length=10, blank=True, null=True, default='')
    category = models.ForeignKey(ProductCategories, blank=False, null=False, default='', on_delete=models.CASCADE)


    def __str__(self):
        return self.name
    
