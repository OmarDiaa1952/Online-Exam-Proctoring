####################### responses #######################

{
    "responses": [ 
        { # registration response
            # http 201 created
            "email": "alaa@mail.com",
            "username": "alaa",
            "password": "pbkdf2_sha256$390000$Oe7XaNXiKFqHEnwde0rwdq$2AFM5UconCwbLnmV7V/2gHUHIVMnXJf1Rz8oXOA/1I4="
        },
        { # login response && refresh token response
            # http 200 ok
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTE4MTIwNCwiaWF0IjoxNjc3NDA1MjA0LCJqdGkiOiI5NGM3NDhjZjZkNmM0ZDc1OTM0ZjdmZmI4YmNkNjYwZiIsInVzZXJfaWQiOjN9.RBq__QN7l2ohymWsPsd7IG9PwJq4ny0cmskzl62EjZ0",
            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc3NDM1MjA0LCJpYXQiOjE2Nzc0MDUyMDQsImp0aSI6IjUxMzk1MzdjM2U0MTQzZGM5NGQ4MDI1YmUxNDU3NGYzIiwidXNlcl9pZCI6M30.97tioxjPbxEHLlGHMzBabPtQYPeS-uVjkXRd02taIn4"
        },
        { # exam edit response
            # http 200 ok
        },
        { # exam delete response
            # http 204 no content with no body
        }
    ]
}

####################### expected requests #######################

{
    "requests": [
        { # expected request format for creating an exam
            # POST request
            "course_id":"1",
            "name":"exam number 2",
            "description":"demo exam",
            "exam_start_date":"2020-05-05T12:12:01",
            "exam_end_date":"2050-05-05T12:12:12",
            "duration":"00:00:05",
            "max_grade":"20"
        },
        { # expected request format for editing an exam
            # i expect exam id to be sent in the url
            # PUT request
            "name":"exam number 2",
            "description":"demo exam v3",
            "exam_start_date":"2020-05-05T12:12:01",
            "exam_end_date":"2050-05-05T12:12:12",
            "duration":"00:00:05",
            "max_grade":"20"
        },
        { # expected request format for deleting an exam
            # DELETE request
        }
    ]
}