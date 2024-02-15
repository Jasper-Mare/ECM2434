# notes on managing the venv

## creating requirements file
> pip freeze > requirements.txt

## check scripts are runnable on current device
If venv cannot be activated, assume permissions are blocked
> Get-ExecutionPolicy -List
> Set-ExecutionPolicy AllSigned

## venv not listed in global environments
delete current venv and remake venv using requirements.txt