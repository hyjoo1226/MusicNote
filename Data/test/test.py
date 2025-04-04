from test.pick_user.get_movies import recommend

a = {
  "openness": 0.2,
  "conscientiousness": 0.4,
  "extraversion": 0.6,
  "agreeableness": 0.9,
  "neuroticism": 1

}

a = recommend({'Action' : 2, 'Adventure' : 2, 'Drama' : 8, 'Fantasy' : 2, 'Horror' : 1, 'Mystery' : 1, 'Romance': 2, 'War' : 2})
print(a, type(a))

credits = [
{
  "role" : "actor1",
  "name" : ""
},
{
  "role" : "actor2",
  "name" : ""
},
{
  "role" : "director",
  "name" : ""
}

]