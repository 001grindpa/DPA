import httpx
from dotenv import load_dotenv
import asyncio
import os
from random import randint
import json

load_dotenv()
api_key = os.getenv("FIREWORKS_API_KEY")


def get_tasks():
    prompt = "give me a list of 50 practices i can follow today, focus on mindset, health, productivity or over-all well being in order to live a healthier life."
    system_prompt = """
    you are a concise daily habbit assistant
    follow these rules:
    1. always return a plane json where the keys are "Task1", "Task2" ... 
       and the values are the actual content. do not say anything else afterwards.
    2. each json property value must not contain more than 6 words.
    3. recommed like the user is doing them today.
    4. for practices that require measurements, include the required measurement size.
    5. do not include the word "daily" (it's supposed to be a real time active task).
    6. at the end of the json include "done" as a property key and True as it's corresponding value.
    """
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    messages = [{"role": "user", "content":prompt}, {"role": "system", "content": system_prompt}]
    payload = {
        "model": "accounts/fireworks/models/gpt-oss-120b",
        "messages": messages,
        "max_tokens": 1300
    }
    url = "https://api.fireworks.ai/inference/v1/chat/completions"

    r = httpx.post(url, headers=headers, json=payload)
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
        return "invalid response"
    
# print(get_tasks())