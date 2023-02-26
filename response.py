####################### responses #######################

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

####################### expected requests #######################

{
    "requests": [
    { # expected request format for creating an exam
        "course_id":"1",
        "name":"exam number 2",
        "description":"demo exam",
        "exam_start_date":"2020-05-05T12:12:01",
        "exam_end_date":"2050-05-05T12:12:12",
        "duration":"00:00:05",
        "max_grade":20
     }
    ]
}