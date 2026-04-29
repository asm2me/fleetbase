from pathlib import Path

path = Path("tmp/fleetbase_vps_setup.sh")
data = path.read_bytes()
path.write_bytes(data.replace(b"\r\n", b"\n"))
print("converted")
