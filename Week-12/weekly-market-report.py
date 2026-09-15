import re
import statistics

sql_path = f"{__import__('os').environ['HOME']}/Desktop/sql/california_sold.sql"

def parse_fields(text):
    fields = []
    current = ""
    in_quote = False
    i = 0

    while i < len(text):
        c = text[i]

        if c == "'":
            if in_quote and i + 1 < len(text) and text[i + 1] == "'":
                current += "'"
                i += 2
                continue
            in_quote = not in_quote
            current += c
        elif c == "," and not in_quote:
            fields.append(current.strip())
            current = ""
        else:
            current += c

        i += 1

    fields.append(current.strip())
    return fields

def clean(value):
    if value == "NULL":
        return None
    return value.strip("'")

rows = []

with open(sql_path, encoding="utf-8") as f:
    for line in f:
        if "INSERT INTO" not in line or "VALUES(" not in line:
            continue

        text = line.split("VALUES(", 1)[1].strip()

        if text.endswith(";"):
            text = text[:-1]

        if text.endswith(")"):
            text = text[:-1]

        fields = parse_fields(text)

        if len(fields) != 46:
            continue

        close_date = clean(fields[6])
        close_price = clean(fields[7])
        property_type = clean(fields[13])
        list_price = clean(fields[15])
        dom = clean(fields[16])

        if (
            property_type == "Residential"
            and close_date
            and re.fullmatch(r"202[5-6]-\d{2}-\d{2}", close_date)
        ):
            rows.append({
                "close_date": close_date,
                "close_price": float(close_price) if close_price else 0,
                "list_price": float(list_price),
                "dom": float(dom)
            })

prices = [r["close_price"] for r in rows]
lists = [r["list_price"] for r in rows]
doms = [r["dom"] for r in rows]
dates = [r["close_date"] for r in rows]

print("WEEK 11 CALIFORNIA SOLD MARKET REPORT")
print("=============================================")
print("Residential sales:", len(rows))
print("Date range:", min(dates), "to", max(dates))
print("Median close price: $", f"{statistics.median(prices):,.2f}")
print("Average close price: $", f"{statistics.mean(prices):,.2f}")
print("Median list price: $", f"{statistics.median(lists):,.2f}")
print("Average days on market:", f"{statistics.mean(doms):.1f}")
print("Median days on market:", f"{statistics.median(doms):.1f}")
