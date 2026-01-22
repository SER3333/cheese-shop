from django.http import HttpResponse

def robots_txt(request):
    lines = [
        "User-Agent: *",
        "Disallow:",
        "Sitemap: https://api.craftova-lavka.com/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")

