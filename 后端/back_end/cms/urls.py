from django.conf.urls import url
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from .views import BookViewSet, OtherViewSet

router = DefaultRouter()
router.register('book', BookViewSet)
router.register('', OtherViewSet, basename='other')
urlpatterns = [
    path('session', views.session),
    path('books', views.Books.as_view()),
    url('', include(router.urls))
]
