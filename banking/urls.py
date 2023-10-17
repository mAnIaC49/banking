from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout"),
    path("game", views.game, name="game"),
    path("save", views.save, name="save"),
    path("load", views.load_info, name="load"),
    path("loadgame", views.load_game, name="loadgame")
]