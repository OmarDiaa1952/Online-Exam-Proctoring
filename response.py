{
    "responses": [ 
        {# in case object is created correctly on registration
            # http 201 created
            "name": "mwatheq",
            "email": "watheq@gmail.com",
            "password": "123"
        },
        {# in case object is not created on registration
            # http 400 bad request
            "name": [
                "This field may not be blank."
            ],
            "email": [
                "This field may not be blank."
            ],
            "password": [
                "This field may not be blank."
            ]
        },
    ]
}