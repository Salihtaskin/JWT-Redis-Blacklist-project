Invoke-RestMethod -Method Get -Uri "http://localhost:3000/auth/profile" -Headers @{ Authorization = "Bearer $token" }
Invoke-RestMethod : {"error":"Token has been revoked"}
At line:1 char:1
+ Invoke-RestMethod -Method Get -Uri "http://localhost:3000/auth/profil ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-RestMethod], WebException
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeRestMethodCommand
PS C:\Users\SALIH> 