from django.shortcuts import render, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.db import IntegrityError
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required



from .models import User, Data

@login_required
def index(request):
    return render(request, 'banking/index.html')


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "banking/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "banking/login.html")

def register(request):
    if request.method == "POST":
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "banking/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(email, email, password)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "banking/register.html", {
                "message": "Email address already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "banking/register.html")
    
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))



@login_required
def game(request):
    if request.method == 'POST':
        people = []
        for i in range(int(request.POST["num"])):
            people.append(request.POST[f"player{i+1}"])

        return render(request, "banking/game.html", {
            "people": people,
            "amount": request.POST["amount"],
            "currency": request.POST["currency"]
        })
    
    else:
        return JsonResponse({
            "error": "POST request required."
        }, status=400)



@csrf_exempt
@login_required
def save(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    # Retrieve data
    data = json.loads(request.body)
    dictionary = data.get("data")

    # Save the currency used in the saved game
    request.user.currency = data.get("currency")
    request.user.save()

    # Get a list of names of the players
    keysList = list(dictionary.keys())

    # Delete the previously saved game
    Data.objects.filter(user=request.user).delete()

    # Save the data
    for key in keysList:
        Data.objects.create(user=request.user, name=key, amount=dictionary[key])

    return JsonResponse(status=200, data={})

        



@csrf_exempt
@login_required
def load_info(request):
    # Retrieve the data from the previously saved game
    data = Data.objects.filter(user = request.user)

    # If it was a post request, return a response informing whether there exists a saved game by the user
    if request.method == 'POST':
        if len(data) == 0:
            return JsonResponse(status=200, data={"saved": False})
        else:
            return JsonResponse(status=200, data={"saved": True})
    else:

        # Create a dictionary containing the key value pairs of name of the players and the amount they had while the game was saved
        value = {}
        for info in data:
            value[info.name] = info.amount
        
        return JsonResponse(status=200, data={"data": value})


@csrf_exempt
@login_required
def load_game(request):
    # Retrieve the names of the players and the currency used in the previously saved game and open a new game page and update the hidden div to show its a loaded game
    data = Data.objects.filter(user = request.user)
    people = data.values_list('name', flat=True)
    currency = request.user.currency

    return render(request, 'banking/game.html', {
        "people": people,
        "amount": 0,
        "currency": currency,
        "loaded": 'yes'
    })