from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class ExmainerRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examiner
        fields = ("email", "username", "password")

    def validate_password(self, value: str) -> str:
        """
        Hash value passed by user.
        :param value: password of a user
        :return: a hashed version of the password
        """
        return make_password(value)

    def create(self, validated_data):
        examiner = Examiner.objects.create(**validated_data)
        return examiner

class StudentRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ("email", "username", "password")
    def create(self, validated_data):
        student = Student.objects.create(**validated_data)
        return student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"

class ExaminerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examiner
        fields = "__all__"