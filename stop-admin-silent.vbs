Set WshShell = CreateObject("WScript.Shell")

' Node.js processlerini kapat
WshShell.Run "taskkill /F /IM node.exe", 0, True

' npm processlerini kapat
WshShell.Run "taskkill /F /IM npm.cmd", 0, True

' Başarı mesajı
MsgBox "Tüm sunucular kapatıldı!" & vbCrLf & vbCrLf & "Port 3002, 3003 ve 5173 serbest bırakıldı.", vbInformation, "Admin Panel Kapatıldı"
