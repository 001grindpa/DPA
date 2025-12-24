import httpx
from dotenv import load_dotenv
import asyncio
import os
from random import randint
import json

load_dotenv()
api_key = os.getenv("FIREWORKS_API_KEY")

async def get_tasks():
    prompt = "prompt: list 50 practices I can do today, focus on mindset, health, productivity or over-all well being to live a better life."
    system_prompt = """
    you are a daily habbit assistant.
    follow these simple rules:
    1. always return a plane json where the keys are "Task1", "Task2" ... and the values are the actual content.
    2. each json property value should not contain more than 6 words.
    3. for certain tasks that require measurement, provide the measuremnt amount.
    4. at the end of the json include "done" as a key and "True" as it's value.
    """
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"

    }
    messages = [{"role": "user", "content":prompt}, {"role": "system", "content": system_prompt}]
    payload = {
        "model": "accounts/fireworks/models/deepseek-v3p1",
        "messages": messages,
        "max_tokens": 700
    }
    url = "https://api.fireworks.ai/inference/v1/chat/completions"

    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(url, headers=headers, json=payload)
        json_data = r.json()
        # return json_data
    data = json_data["choices"][0]["message"]["content"]
    if "done" in data:
        tasks = json.loads(data)

        all_tasks = []
        numbers = list(range(1, 50))

        rand_25 = []

        for j in tasks:
            all_tasks.append(tasks[j])

        # append 50 distinct numbers (1-50) in random order into a list
        for i in range(100):
            n = randint(1, 51)
            if n in rand_25:
                pass
            else:
                rand_25.append(n)
            if len(rand_25) == 25:
                break

        mapped_tasks = dict(zip(numbers, all_tasks))
        
        final = []
        for key in mapped_tasks:
            for r in rand_25:
                if key == r:
                    final.append(mapped_tasks[key])
        
        return final
    else:
        return "server side error"
    
# print(asyncio.run(get_tasks()))