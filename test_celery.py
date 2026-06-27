from workers.tasks import process_settlement


result = process_settlement.delay(1)

print("Task sent successfully")
print("Task ID:", result.id)