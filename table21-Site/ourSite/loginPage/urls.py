#written by Hannah Jellett
from django.urls import path, include
from django.contrib import auth
from django.contrib.auth import views as auth_views


from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static


from . import views

from django.contrib.auth.views import (
    LogoutView, 
    PasswordResetView, 
    PasswordResetDoneView, 
    PasswordResetConfirmView,
    PasswordResetCompleteView
)

urlpatterns = [
    path("", views.index, name="index"),
    path("Register", views.register, name="Register"),
    path("hash", views.hashPass, name="hash"),
    path("passCheck", views.passCheck, name="passCheck"),
    path("emailCheck", views.emailCheck, name="emailCheck"),

    #path("password-reset-confirm/<uidb64>/<token>/", auth_views.PasswordResetConfirmView.as_view(template_name="'loginPage/password_reset_confirm.html")),
    path('password-reset-form', PasswordResetView.as_view(template_name='registration/password_reset_form.html'), name='password_reset_form'),
    path('password-reset/done/', PasswordResetDoneView.as_view(template_name='registration/password_reset_done.html'), name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(template_name='registration/password_reset_confirm.html'), name='password_reset_confirm'),
    path('password-reset-complete/', PasswordResetCompleteView.as_view(template_name='registration/password_reset_complete.html'), name='password_reset_complete'),

]
