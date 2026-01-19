Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Script'in bulunduğu dizini al
scriptPath = fso.GetParentFolderName(WScript.ScriptFullName)

' Port kontrolü fonksiyonu
Function IsPortOpen(port)
    On Error Resume Next
    Set objHTTP = CreateObject("WinHttp.WinHttpRequest.5.1")
    objHTTP.Open "GET", "http://localhost:" & port, False
    objHTTP.SetTimeouts 100, 100, 100, 100
    objHTTP.Send
    IsPortOpen = (Err.Number = 0)
    On Error Goto 0
End Function

' Sunucuları paralel başlat (hızlı)
WshShell.Run "cmd /c cd /d """ & scriptPath & """ && start /B node analytics-server.js", 0, False
WshShell.Run "cmd /c cd /d """ & scriptPath & """ && start /B node admin-server.js", 0, False
WshShell.Run "cmd /c cd /d """ & scriptPath & """ && start /B npm run dev", 0, False

' Tarayıcıyı hemen aç (sunucular arka planda hazırlanırken)
WScript.Sleep 500
WshShell.Run "http://localhost:3001/admin/login", 1, False
