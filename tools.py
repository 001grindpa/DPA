from datetime import datetime
import asyncio

# unix = int(time.time())

current_hour = datetime.now().hour
toHour = 20 - current_hour
fullTime = toHour * 3600

async def countDown():
    global fullTime

    hr = int(fullTime/3600)
    min = int(fullTime/60)
    min = min % 60
    sec = fullTime % 60
    if min < 10:
        min = f"0{min}"
    if sec < 10:
        sec = f"0{sec}"

    await asyncio.sleep(1)
    
    print(f"{hr}hr {min}min {sec}sec")
    fullTime -= 1

# while toHour > 0:
#     asyncio.run(countDown())