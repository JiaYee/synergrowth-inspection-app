# SynergrowthInspectionApp — Hardware Procurement Recommendation

## 1. Solution Overview

The Synergrowth Inspection App is a manufacturing quality inspection system comprising:

- **Android mobile app** (React Native / Expo) used by operators on the production floor
- **Python backend API** (serving deep learning inference endpoints `/predict` and `/final`)
- **PostgreSQL database** for storing inspection results, metadata, and image references
- **File storage** for captured inspection images

### Workflow

1. Operator enters metadata (product model, production line, station, shift, operator ID)
2. App directs operator to photograph specific product components
3. Captured image is cropped on-device and sent to the in-house server
4. Deep learning model classifies the component as **PASS** or **FAIL**
5. Operator confirms or overrides the machine prediction
6. Final result (image + metadata + predictions) is stored in PostgreSQL

### Deployment Model

**Fully on-premises / in-house** — a dedicated local network connects Android devices to the server. No dependency on site internet or cloud services.

```
[Android Devices] ── Wi-Fi ──▶ [Dedicated Access Point] ── LAN ──▶ [In-House Server]
                                                                      ├── Python API
                                                                      ├── DL Model
                                                                      └── PostgreSQL
```

---

## 2. Android Device Recommendation (Mid Tier)

### Recommended Devices

| Device | Key Specs | Est. Price (MYR) |
|---|---|---|
| **Samsung Galaxy A25 5G** | 6.5" Super AMOLED, 50MP camera, Exynos 1280, 6GB RAM, Android 14, IP67 water resistance | RM 800 – RM 1,000 |
| **Samsung Galaxy A15** | 6.5" Super AMOLED, 50MP camera, MediaTek Helio G99, 6GB RAM, Android 14 | RM 650 – RM 800 |
| **Samsung Galaxy Tab A9** (tablet option) | 8.7" TFT, 8MP camera, MediaTek Helio G99, 4GB RAM, Android 13 | RM 750 – RM 1,000 |

### Preferred Pick: Samsung Galaxy A25 5G

**Rationale:**

- **50MP rear camera** — provides clear, detailed images for component inspection
- **IP67 rating** — splash/dust resistance suitable for production floor conditions
- **6.5" AMOLED display** — operators can clearly see PASS/FAIL results and captured images
- **Sufficient performance** — Exynos 1280 handles the React Native app, image cropping, and network uploads without lag
- **Wide availability in Malaysia** — easily procured from authorized Samsung retailers
- **One UI / Android 14** — long software support, familiar to most users

### Accessories (Per Device)

| Item | Est. Price (MYR) |
|---|---|
| Rugged protective case (e.g. OtterBox Defender / Spigen Tough Armor) | RM 80 – RM 150 |
| Tempered glass screen protector | RM 20 – RM 40 |
| Lanyard / wrist strap | RM 10 – RM 20 |

### Quantity Recommendation

| Item | Qty | Unit Price (MYR) | Total (MYR) |
|---|---|---|---|
| Samsung Galaxy A25 5G (production units) | 5 | RM 900 | RM 4,500 |
| Samsung Galaxy A25 5G (hot spares) | 2 | RM 900 | RM 1,800 |
| Rugged case + screen protector + lanyard (per device) | 7 | RM 150 | RM 1,050 |
| **Subtotal — Mobile Devices** | | | **RM 7,350** |

> **Note:** Quantity of 5 production units assumes one device per production line/station. Adjust based on actual number of inspection stations. The 2 hot spares ensure zero downtime if a device is damaged or needs charging.

---

## 3. In-House Server Recommendation

### 3A. GPU Server (Recommended — Fastest Inference)

For real-time deep learning inference with sub-second response times.

| Component | Specification | Est. Price (MYR) |
|---|---|---|
| **Server Chassis** | Dell PowerEdge T360 / HP ProLiant ML30 Gen11 Tower | RM 6,000 – RM 8,000 |
| **CPU** | Intel Xeon E-2488 (8C/16T) or AMD Ryzen 9 7900 | (included with server) |
| **RAM** | 32 GB DDR5 ECC | (included / RM 600 upgrade) |
| **GPU** | NVIDIA RTX 4060 (8GB VRAM) | RM 1,500 – RM 1,800 |
| **Boot Drive** | 1 TB NVMe SSD (OS + Python app + model) | RM 450 – RM 600 |
| **Data Drive** | 2 x 2TB SATA SSD in RAID 1 (images + PostgreSQL data) | RM 1,600 – RM 2,000 |
| **PSU** | 650W 80+ Gold (included with tower server) | (included) |
| **OS** | Ubuntu Server 24.04 LTS | Free |
| **Subtotal — GPU Server** | | **RM 10,150 – RM 13,000** |

### 3B. CPU-Only Server (Budget Alternative)

Suitable if the deep learning model is lightweight. Expect inference times of 1–3 seconds per image (vs <500ms on GPU). Can be optimized using ONNX Runtime or OpenVINO.

| Component | Specification | Est. Price (MYR) |
|---|---|---|
| **Server Chassis** | Dell PowerEdge T150 / HP ProLiant ML30 Gen11 Tower | RM 5,000 – RM 7,000 |
| **CPU** | Intel Xeon E-2488 (8C/16T) | (included) |
| **RAM** | 32 GB DDR5 ECC | (included / RM 600 upgrade) |
| **Boot Drive** | 512 GB NVMe SSD | RM 250 – RM 350 |
| **Data Drive** | 2 x 2TB SATA SSD in RAID 1 | RM 1,600 – RM 2,000 |
| **OS** | Ubuntu Server 24.04 LTS | Free |
| **Subtotal — CPU-Only Server** | | **RM 7,450 – RM 9,950** |

### Software Stack (Server)

| Layer | Technology |
|---|---|
| Operating System | Ubuntu Server 24.04 LTS |
| Python Runtime | Python 3.11+ |
| API Framework | Flask / FastAPI |
| Deep Learning | PyTorch + CUDA (GPU) or ONNX Runtime (CPU) |
| Database | PostgreSQL 16 |
| Process Manager | systemd or Supervisor |
| Reverse Proxy | Nginx (optional, for clean routing) |

### Storage Capacity Planning

| Metric | Value |
|---|---|
| Average image size (cropped JPEG) | ~200 KB – 500 KB |
| Inspections per day (estimated) | 1,000 |
| Daily storage growth | ~500 MB |
| Monthly storage growth | ~15 GB |
| Yearly storage growth | ~180 GB |
| **2 x 2TB RAID 1 capacity** | **~2 TB usable** |
| **Projected lifespan at current rate** | **~10 years** |

---

## 4. Network Infrastructure

Since this is a fully isolated, in-house deployment with no site internet dependency, a dedicated local network is required.

| Component | Recommendation | Est. Price (MYR) |
|---|---|---|
| **Wi-Fi Access Point** | TP-Link EAP670 (Wi-Fi 6, ceiling mount) or Ubiquiti UniFi U6+ | RM 500 – RM 800 |
| **Network Switch** | 8-port Gigabit managed switch (e.g. TP-Link TL-SG108E) | RM 150 – RM 250 |
| **Ethernet Cables** | Cat6 cables (server to switch, switch to AP) | RM 50 – RM 100 |
| **UPS** | APC Back-UPS 1500VA / CyberPower CP1500 (for server + network gear) | RM 800 – RM 1,200 |
| **Subtotal — Network** | | **RM 1,500 – RM 2,350** |

### Network Configuration

| Setting | Value |
|---|---|
| Subnet | `192.168.10.0/24` |
| Server static IP | `192.168.10.100` |
| DHCP range (devices) | `192.168.10.10` – `192.168.10.50` |
| Wi-Fi SSID | `SYNERGROWTH-INSPECTION` (hidden SSID recommended) |
| Wi-Fi Security | WPA3-Personal or WPA2-Enterprise |
| Network isolation | Dedicated VLAN, no route to corporate/internet network |

### App Configuration Change

The API URLs in the mobile app must be updated to point to the local server:

```typescript
// services/api.ts
const API_BASE_URL = 'http://192.168.10.100:8000';
const PREDICT_API_URL = 'http://192.168.10.100:8000/predict';
const FINAL_API_URL = 'http://192.168.10.100:8000/final';
```

---

## 5. Total Cost Summary

### Option A — GPU Server (Recommended)

| Category | Est. Cost (MYR) |
|---|---|
| Android devices (5 + 2 spares) + accessories | RM 7,350 |
| GPU server (Dell/HP tower + RTX 4060) | RM 10,150 – RM 13,000 |
| Network infrastructure (AP + switch + UPS + cabling) | RM 1,500 – RM 2,350 |
| **Total** | **RM 19,000 – RM 22,700** |

### Option B — CPU-Only Server (Budget)

| Category | Est. Cost (MYR) |
|---|---|
| Android devices (5 + 2 spares) + accessories | RM 7,350 |
| CPU-only server (Dell/HP tower) | RM 7,450 – RM 9,950 |
| Network infrastructure (AP + switch + UPS + cabling) | RM 1,500 – RM 2,350 |
| **Total** | **RM 16,300 – RM 19,650** |

---

## 6. Additional Recommendations

### Device Management
- Use **Samsung Knox Manage** or **Google Endpoint Management** to lock devices into kiosk mode (only the inspection app runs)
- Disable unnecessary apps, notifications, and system updates on production devices
- Set screen timeout to 5+ minutes so operators don't have to constantly unlock

### Backup Strategy
- Schedule **daily PostgreSQL backups** using `pg_dump` to an external USB drive or NAS
- Implement image directory backup on a weekly basis
- Keep at least 30 days of rolling backups

### Security
- Use a **hidden SSID** and WPA3 encryption for the dedicated Wi-Fi network
- Restrict server access to the inspection subnet only
- Disable SSH password auth; use key-based authentication
- Run PostgreSQL on `localhost` only; do not expose port 5432 to the network
- Set up `ufw` firewall on the server allowing only port 8000 from the inspection subnet

### Monitoring
- Use a simple health-check script (cron job) that pings the API and alerts if the server is unresponsive
- Monitor disk usage to plan storage expansion before it fills up
- Monitor PostgreSQL connection count and query performance

---

## 7. Procurement Checklist

- [ ] Procure 7 x Samsung Galaxy A25 5G (or equivalent mid-tier Android device)
- [ ] Procure 7 x rugged cases + screen protectors + lanyards
- [ ] Procure 1 x tower server (Dell PowerEdge T360 / HP ProLiant ML30 Gen11)
- [ ] Procure 1 x NVIDIA RTX 4060 GPU (if Option A)
- [ ] Procure 1 x 1TB NVMe SSD + 2 x 2TB SATA SSD
- [ ] Procure 1 x Wi-Fi 6 access point (TP-Link EAP670 / Ubiquiti U6+)
- [ ] Procure 1 x 8-port Gigabit managed switch
- [ ] Procure 1 x UPS 1500VA
- [ ] Procure Cat6 Ethernet cables (appropriate lengths)
- [ ] Install Ubuntu Server 24.04 LTS on server
- [ ] Install and configure PostgreSQL 16
- [ ] Deploy Python backend API + deep learning model
- [ ] Configure dedicated Wi-Fi network (hidden SSID, WPA3)
- [ ] Update app API URLs to point to local server IP
- [ ] Build and deploy APK to all Android devices
- [ ] Test end-to-end: capture → predict → submit → verify in database
- [ ] Set up backup schedule (PostgreSQL + images)
- [ ] Configure device kiosk mode via Knox / MDM

---

*Document generated: February 2026*
*Project: SynergrowthInspectionApp*
*Currency: Malaysian Ringgit (MYR)*
*Prices are estimates and may vary by retailer and availability.*
