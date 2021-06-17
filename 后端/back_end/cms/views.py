import json

from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import api_view, action
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from cms.models import User, Book
from cms.serializers import BookSerializer


@api_view(['POST'])
def session(request):
    login_info = JSONParser().parse(request)
    try:
        User.objects.get(username=login_info['username'], password=login_info['password'])
    except User.DoesNotExist:
        return JsonResponse({'success': False}, safe=True)
    res = {
        'success': True
    }
    return HttpResponse(json.dumps(res), content_type='application/json')


class MyPageNumberPagination(PageNumberPagination):
    page_size = 20
    max_page_size = 100
    page_size_query_param = 'per_page'
    page_query_param = 'page'


class Books(APIView):
    def get(self, request):
        import math
        page = int(request.GET['page'])
        per_page = int(request.GET['per_page'])
        bookQueryset = Book.objects.all()
        total_count = bookQueryset.count()
        pageNumberPagination = MyPageNumberPagination()
        page_books = pageNumberPagination.paginate_queryset(queryset=bookQueryset, request=request, view=self)
        result = {
            "page": page,
            "per_page": per_page,
            "total": total_count,
            "total_pages": math.ceil(total_count / per_page),
            "data": BookSerializer(instance=page_books, many=True).data,
        }
        return Response(result)


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class OtherViewSet(viewsets.ModelViewSet):
    @action(detail=False, methods=['get'])
    def search(self, request):
        books = Book.objects.all()
        if request.GET['id'] != '':
            books = books.filter(id=int(request.GET['id']))
        if request.GET['name'] != '':
            books = books.filter(name=request.GET['name'])
        books = books.filter(price__gte=request.GET['price_lower_bound'], price__lte=request.GET['price_upper_bound'])
        return Response(BookSerializer(books, many=True).data)
