from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password

#################### General Serializers ####################

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    # username_field = User.EMAIL_FIELD #  should edit to enable username or email login
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        # token['username'] = user.username
        # ...
        return token

#################### Examiner Serializers ####################

class ExmainerRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examiner
        fields = ("email", "username", "password", "first_name", "last_name")

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

#################### Student Serializers ####################

class StudentRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ("email", "username", "password", "first_name", "last_name")
    
    def validate_password(self, value: str) -> str:
        return make_password(value)
        
    def create(self, validated_data):
        student = Student.objects.create(**validated_data)
        return student

class PhotoUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ("photo",)

    # update existing profile
    def update(self, instance, validated_data):
        instance.photo = validated_data.get("photo", instance.photo)
        instance.save()
        return instance