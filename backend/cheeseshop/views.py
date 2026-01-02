from django.http import HttpResponse

def robots_txt(request):
    lines = [
        "User-Agent: *",
        "Disallow:",
        "Sitemap: https://cheese-shop-production.up.railway.app/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")