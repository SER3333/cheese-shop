from django.http import HttpResponse

def robots_txt(request):
    lines = [
        "User-Agent: *",
        "Disallow:",
        "Sitemap: http://cheese-shop.railway.internal/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")