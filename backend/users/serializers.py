from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
from json import loads

#################### General Serializers ####################

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        # token['username'] = user.username
        # ...
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add user role to the response
        data['role'] = self.user.role
        return data

class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "username", "first_name", "last_name")

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
        examiner = Examiner(**validated_data)
        error_response = examiner.save(force_insert=True)
        if isinstance(error_response, JsonResponse):
            raise serializers.ValidationError(loads(error_response.content))
        return examiner

#################### Student Serializers ####################

class StudentRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ("email", "username", "password", "first_name", "last_name")
    
    def validate_password(self, value: str) -> str:
        return make_password(value)
        
    def create(self, validated_data):
        student = Student(**validated_data)
        error_response = student.save(force_insert=True)
        if isinstance(error_response, JsonResponse):
            raise serializers.ValidationError(loads(error_response.content))
        return student