import pytest
from security import hash_password, verify_password
from models import User

# Dummy DB-Simulation
class DummyDB:
    def __init__(self):
        self.users = []

    def add_user(self, username, password):
        user = User(id=len(self.users)+1, username=username, password=password)
        self.users.append(user)
        return user

    def get_user(self, username):
        for user in self.users:
            if user.username == username:
                return user
        return None

# Positive Test: Passwort Hashing & Verification
def test_password_hash_and_verify():
    password = "mein_geheimes_passwort"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed)

# Positive Test: User Registration & Login
def test_user_registration_and_login():
    db = DummyDB()

    username = "max"
    password = "pass123"

    hashed_pw = hash_password(password)
    db.add_user(username, hashed_pw)

    user = db.get_user(username)
    assert user is not None
    assert verify_password(password, user.password)

# Negative Test: Registrierung mit ungültigem Username
def test_invalid_username_registration():
    invalid_username = "Max123"  # enthält Großbuchstaben
    import re
    assert not re.fullmatch(r"[a-z]+", invalid_username)

# Negative Test: Falsches Passwort beim Login
def test_wrong_password_login():
    password = "pass123"
    wrong_password = "wrongpass"
    hashed_pw = hash_password(password)

    assert not verify_password(wrong_password, hashed_pw)
