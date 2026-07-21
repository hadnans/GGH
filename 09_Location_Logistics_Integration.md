# 09 — Location & Logistics Integration

> **GGH — Gomla Go Home (جملة لحد البيت)**
> Location Intelligence, Fleet Management & ERPNext Logistics Specification

| Field | Value |
|-------|-------|
| **Document** | 09 — Location & Logistics Integration |
| **Version** | 1.0.0 |
| **Status** | Master Blueprint |
| **Author** | GGH Architecture Team |
| **Last Updated** | 2025-07-11 |
| **Dependencies** | 02-Architecture, 06-Database, 07-API, 09-CommerceFlow, 11-ERPIntegration |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Business Goals](#2-business-goals)
3. [Overall Architecture](#3-overall-architecture)
4. [Maps Provider](#4-maps-provider)
5. [Customer Location System](#5-customer-location-system)
6. [Warehouse Management](#6-warehouse-management)
7. [Driver Management](#7-driver-management)
8. [Fleet Management](#8-fleet-management)
9. [Live Delivery Tracking](#9-live-delivery-tracking)
10. [ERPNext Integration](#10-erpnext-integration)
11. [Warehouse Selection Logic](#11-warehouse-selection-logic)
12. [Delivery Assignment Engine](#12-delivery-assignment-engine)
13. [Route Optimization](#13-route-optimization)
14. [Geofencing](#14-geofencing)
15. [Live GPS Streaming](#15-live-gps-streaming)
16. [Customer Tracking Page](#16-customer-tracking-page)
17. [Admin Dashboard](#17-admin-dashboard)
18. [Warehouse Dashboard](#18-warehouse-dashboard)
19. [Mobile Driver Interface](#19-mobile-driver-interface)
20. [Database Design](#20-database-design)
21. [Security](#21-security)
22. [Performance](#22-performance)
23. [Accessibility](#23-accessibility)
24. [Future Expansion](#24-future-expansion)
25. [Recommended Technology Stack](#25-recommended-technology-stack)

---

## 1. Overview

### 1.1 Purpose

Location Intelligence is not a feature bolted onto GGH — it is a foundational capability woven into every layer of the platform. In a wholesale grocery delivery business, **where things are** determines **what can be sold, when it can arrive, who delivers it, and how much it costs**.

Without location intelligence, GGH cannot:

- Tell a customer when their 25 kg rice sack will arrive
- Assign the right driver from the right warehouse
- Optimize routes for a fleet of 50+ delivery vehicles across Cairo
- Prevent warehouse stockouts by rebalancing inventory across regions
- Provide the "Uber-like" tracking experience Egyptian consumers now expect

### 1.2 Maps as a Core Primitive

Maps are not just a pin on a screen. In GGH, maps become the **visual and computational substrate** for:

| Domain | How Maps Are Core |
|--------|-------------------|
| **ERP** | Warehouse locations, inventory distribution, regional stock visibility |
| **Warehouse Management** | Coverage radius, zone assignment, capacity heatmaps, proximity-based dispatch |
| **Deliveries** | Route computation, ETA calculation, live tracking, proof-of-location delivery confirmation |
| **Customer Experience** | Pin-drop addressing, saved locations, live driver tracking, delivery notifications |
| **Fleet Monitoring** | Vehicle positions, speed, heading, idle detection, geofence violations |

### 1.3 Guiding Principles

| Principle | Description |
|-----------|-------------|
| **Location-First Thinking** | Every entity that exists in the physical world (warehouse, driver, customer, order) has coordinates |
| **ERP as Source of Truth** | ERPNext owns warehouse locations, driver records, fleet data; GGH reads and enhances |
| **Eventually Consistent** | GPS positions may lag 2–5 seconds; warehouse inventory syncs every 5 minutes |
| **Never Block the Customer** | If GPS fails, fall back to zone-based estimates; if maps fail, show text-based status |
| **Elder-Friendly** | Om Ibrahim (62) must understand tracking with zero technical knowledge |
| **Egypt-First** | Optimize for Egyptian addresses (landmarks > street numbers), Arabic-first UI, local mapping data |
| **Offline-Resilient** | Drivers in areas with poor connectivity must still function; queue and sync later |

### 1.4 Scope Boundary

| In Scope | Out of Scope |
|----------|-------------|
| Customer location management | Indoor navigation (warehouses) |
| Warehouse location & zones | Autonomous vehicles |
| Driver GPS tracking | Drone delivery (Phase 2+) |
| Live delivery tracking | Real-time traffic data generation |
| Route optimization | Satellite imagery processing |
| Geofencing | GIS cadastral mapping |
| ERPNext location integration | Third-party marketplace logistics |
| Fleet management | Refrigerated fleet monitoring |
| Mobile driver app spec | Native iOS/Android development |

---

## 2. Business Goals

### 2.1 Why GPS Matters for GGH

GGH operates in Egyptian cities where:

- Addresses are landmark-based ("behind the mosque, next to the pharmacy")
- Traffic is unpredictable — a 3 km delivery can take 10 minutes or 60 minutes
- Customers expect to **see** their delivery approaching, not just receive a phone call
- Warehouse density determines delivery speed and cost
- Driver efficiency directly impacts profitability

### 2.2 Business Objectives

| # | Objective | Metric | Target |
|---|-----------|--------|--------|
| BG-1 | Live delivery tracking | % of active orders trackable | ≥ 99% |
| BG-2 | Warehouse visibility | % of inventory with warehouse coords | 100% |
| BG-3 | Driver monitoring | % of drivers with live GPS | ≥ 95% |
| BG-4 | Route optimization | Avg. delivery time reduction | ≥ 20% |
| BG-5 | Delivery ETA accuracy | ETA within ±10 min of actual | ≥ 85% |
| BG-6 | Proof of delivery | % of deliveries with GPS+photo confirmation | ≥ 98% |
| BG-7 | Logistics analytics | Fleet utilization rate | ≥ 75% |
| BG-8 | Customer satisfaction | "Can I track my order?" support tickets | ↓ 80% |
| BG-9 | Cost reduction | Cost per delivery (EGP) | ↓ 15% |
| BG-10 | Delivery zone coverage | % of Greater Cairo addressable | ≥ 90% |

### 2.3 Stakeholder Value Map

| Stakeholder | What They Need | How Location Intelligence Delivers |
|-------------|----------------|-----------------------------------|
| **Om Ibrahim** (Customer) | "Where is my order?" | Live map with driver moving toward his house |
| **Abou Ahmed** (B2B Buyer) | "Will my stock arrive before I open?" | Accurate ETA, warehouse proximity, delivery window |
| **Mariam** (Tech-Savvy) | "I want to track like Uber" | Real-time map, driver info, push notifications |
| **Driver** | "Where do I go next?" | Turn-by-turn navigation, optimized multi-stop routes |
| **Warehouse Manager** | "Which driver is closest?" | Live driver map, dispatch recommendations |
| **Operations Manager** | "Are we efficient?" | Fleet heatmaps, delivery KPIs, route analytics |
| **Finance** | "What does delivery cost?" | Distance-based costing, fuel estimates, zone pricing |

### 2.4 Revenue Impact Model

```
┌─────────────────────────────────────────────────────────┐
│              Location Intelligence → Revenue             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Better ETA → Higher conversion (trust)                 │
│       ↓                                                 │
│  Route optimization → More deliveries per driver/day    │
│       ↓                                                 │
│  Live tracking → Fewer support calls → Lower cost       │
│       ↓                                                 │
│  Zone coverage → More addressable customers → Revenue ↑ │
│       ↓                                                 │
│  Warehouse proximity → Faster delivery → Higher AOV     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Overall Architecture

### 3.1 System Context Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Customer   │     │    Driver    │     │    Admin     │
│  (Browser)   │     │  (Mobile)    │     │  (Browser)   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Next.js    │     │   Driver     │     │   Next.js    │
│   Frontend   │     │    App       │     │   Admin UI   │
│  (Port 3000) │     │  (Mobile)    │     │  (Port 3000) │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────┐
│                    BFF API Layer                         │
│              Next.js API Routes (/api/v1/*)              │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │ Location │ │ Tracking │ │ Delivery │ │  Warehouse  │ │
│  │   API    │ │   API    │ │   API    │ │    API      │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘ │
└───────┼────────────┼────────────┼──────────────┼────────┘
        │            │            │              │
        ▼            ▼            ▼              ▼
┌──────────────────────────────────────────────────────────┐
│                   Medusa v2 (Port 9000)                  │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │  Order   │ │ Shipping │ │ Customer │ │  Fulfillment│ │
│  │ Module   │ │ Module   │ │ Module   │ │   Module    │ │
│  └────┬─────┘ └──────────┘ └────┬─────┘ └─────┬──────┘ │
└───────┼──────────────────────────┼──────────────┼────────┘
        │                          │              │
        ▼                          ▼              ▼
┌──────────────────────────────────────────────────────────┐
│                  ERPNext (Port 8000)                     │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │Warehouse │ │  Driver  │ │  Fleet   │ │  Delivery  │ │
│  │ Locations│ │ Records  │ │ Vehicles │ │ Trips      │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                Location Service (Port 3004)              │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │   GPS    │ │  Route   │ │ Geofence │ │  Tracking  │ │
│  │ Ingestion│ │ Computer │ │  Engine  │ │  Session   │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘ │
└───────┼────────────┼────────────┼──────────────┼────────┘
        │            │            │              │
        ▼            ▼            ▼              ▼
┌──────────────────────────────────────────────────────────┐
│                  External Services                       │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │  Maps    │ │  Routing │ │Geocoding │ │  Traffic   │ │
│  │ Provider │ │   API    │ │   API    │ │    API     │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
└──────────────────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              Driver Devices (GPS Emitters)               │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │ Driver A │ │ Driver B │ │ Driver C │ │  Driver N  │ │
│  │ lat/lng  │ │ lat/lng  │ │ lat/lng  │ │  lat/lng   │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 3.2 Data Flow Sequences

#### 3.2.1 Order Placement → Delivery Assignment

```
Customer        BFF             Medusa          ERPNext         Location        Driver
   │              │               │               │             Service          │
   │──Place Order─▶│               │               │               │             │
   │              │──Create Order──▶│               │               │             │
   │              │               │──Push to ERP──▶│               │             │
   │              │               │               │──Find WH──────▶│             │
   │              │               │               │◀──Nearest WH──│             │
   │              │               │               │──Assign Driver▶│             │
   │              │               │               │               │──Notify──────▶│
   │              │               │               │               │◀──Accept─────│
   │              │◀──Order Conf──│               │               │             │
   │◀──Track URL──│               │               │               │             │
```

#### 3.2.2 Live GPS Tracking Flow

```
Driver          Location        Redis           BFF             Customer
Device          Service         Pub/Sub         SSE/WS          Browser
   │               │               │               │               │
   │──GPS (2s)────▶│               │               │               │
   │               │──Store Redis──▶│               │               │
   │──GPS (4s)────▶│               │               │               │
   │               │──Store Redis──▶│               │               │
   │               │──Publish──────▶│               │               │
   │               │               │──Subscribe────▶│               │
   │               │               │               │──SSE/WS──────▶│
   │──GPS (6s)────▶│               │               │               │
   │               │──Store Redis──▶│               │               │
   │               │──Publish──────▶│               │               │
   │               │               │──Subscribe────▶│               │
   │               │               │               │──SSE/WS──────▶│
```

#### 3.2.3 Warehouse Selection Flow

```
Order           ERPNext         Location        Warehouse
Received        Inventory       Service         Database
   │               │               │               │
   │──Lookup Item──▶│               │               │
   │               │──Check Stock──▶│               │
   │               │               │──Find Near────▶│
   │               │               │◀──WH List─────│
   │               │               │──Calc Distance▶│
   │               │               │◀──Distances────│
   │               │               │──Check Capacity▶              │
   │               │               │◀──Capacity─────│
   │               │◀──Best WH─────│               │
   │◀──Assign WH───│               │               │
```

### 3.3 Service Inventory

| Service | Port | Responsibility | Technology |
|---------|------|---------------|------------|
| Next.js (Frontend + BFF) | 3000 | SSR, API gateway, session management | Next.js 16, React 19 |
| Medusa v2 | 9000 | Commerce engine (orders, customers, fulfillment) | Node.js, Medusa |
| ERPNext | 8000 | ERP, warehouse locations, driver records, fleet | Python, Frappe |
| Location Service | 3004 | GPS ingestion, geofencing, routing, tracking sessions | Bun, Socket.io |
| BullMQ Worker | — | Background jobs (ERP sync, notifications, route computation) | Node.js, BullMQ |
| PostgreSQL | 5432 | Primary database (public + ggh schemas) | PostgreSQL 16 |
| Redis | 6379 | Cache, session store, GPS pub/sub, BullMQ queues | Redis 7 |

### 3.4 Dependency Graph

```
                    ┌─────────────┐
                    │  Customer   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Next.js    │
                    │  Frontend   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼─────┐ ┌───▼────┐ ┌────▼─────┐
       │  Medusa    │ │ Redis  │ │ Location │
       │  v2        │ │ Cache  │ │ Service  │
       └──────┬─────┘ └───┬────┘ └────┬─────┘
              │            │            │
       ┌──────▼─────┐     │     ┌──────▼─────┐
       │  ERPNext   │◄────┘     │ Maps API   │
       │            │           │ (External) │
       └──────┬─────┘           └────────────┘
              │
       ┌──────▼─────┐
       │ PostgreSQL │
       │ (ggh schema)│
       └────────────┘
```

---

## 4. Maps Provider

### 4.1 Provider Comparison

| Criterion | Google Maps | Mapbox | OpenStreetMap | HERE Maps |
|-----------|------------|--------|---------------|-----------|
| **Coverage (Egypt)** | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| **Arabic RTL Support** | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ |
| **Geocoding (Egypt)** | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ |
| **Routing (Cairo)** | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★★ |
| **Real-time Traffic** | ★★★★★ | ★★★☆☆ | ☆☆☆☆☆ | ★★★★★ |
| **Pricing (Start)** | $200/mo free tier | 50k loads/mo free | Free | 250k transactions free |
| **Pricing (Scale)** | $$$ | $$ | Free | $$ |
| **Map Customization** | ★★★☆☆ | ★★★★★ | ★★★★☆ | ★★★★☆ |
| **Mobile SDK** | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★☆ |
| **POI Data (Egypt)** | ★★★★★ | ★★★☆☆ | ★★☆☆☆ | ★★★★☆ |
| **Reverse Geocoding** | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ |
| **Offline Maps** | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★★☆ |
| **Rate Limits** | Strict | Moderate | None (self-host) | Moderate |
| **Vendor Lock-in** | High | Medium | None | Medium |

### 4.2 Decision Matrix

| Criterion | Weight | Google Maps | Mapbox | OSM | HERE |
|-----------|--------|------------|--------|-----|------|
| Egypt Coverage | 25% | 5 | 4 | 2 | 4 |
| Arabic Support | 20% | 5 | 4 | 2 | 4 |
| Traffic Data | 15% | 5 | 3 | 0 | 5 |
| Cost at Scale | 15% | 2 | 4 | 5 | 4 |
| Customization | 10% | 3 | 5 | 4 | 4 |
| Mobile SDK | 10% | 5 | 5 | 2 | 4 |
| POI Quality | 5% | 5 | 3 | 2 | 4 |
| **Weighted Score** | **100%** | **4.45** | **3.95** | **2.15** | **4.05** |

### 4.3 Recommendation

| Environment | Primary | Fallback | Rationale |
|-------------|---------|----------|-----------|
| **Development** | Mapbox | OSM | Free tier, excellent customization, fast iteration |
| **Production (Egypt)** | Google Maps | Mapbox | Best Egypt coverage, Arabic, traffic, POI data |
| **Production (MENA)** | Google Maps | HERE | Both have strong Middle East data |
| **Production (Worldwide)** | Google Maps | HERE | Global coverage with traffic |

### 4.4 Multi-Provider Strategy

GGH implements a **provider abstraction layer** so the maps provider can be swapped without changing business logic:

```
┌─────────────────────────────────┐
│      Application Layer          │
│  (Components, Pages, Dashboards)│
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│     Maps Abstraction Layer      │
│                                 │
│  ┌──────────┐  ┌──────────────┐ │
│  │ MapView  │  │ RouteEngine  │ │
│  │ Component│  │  Interface   │ │
│  └──────────┘  └──────────────┘ │
│  ┌──────────┐  ┌──────────────┐ │
│  │ Geocoder │  │  TileSource  │ │
│  │ Interface│  │  Interface   │ │
│  └──────────┘  └──────────────┘ │
└──────────────┬──────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│Google │ │Mapbox │ │ HERE  │
│Maps   │ │       │ │ Maps  │
└───────┘ └───────┘ └───────┘
```

### 4.5 Maps API Configuration

| Setting | Value | Notes |
|---------|-------|-------|
| Default center (Cairo) | 30.0444, 31.2357 | GGH HQ area |
| Default zoom (city) | 12 | Shows all of Cairo |
| Default zoom (neighborhood) | 15 | Street-level detail |
| Default zoom (delivery tracking) | 16 | Building-level detail |
| Map language | Follows `lang` store | Arabic or English labels |
| Map region bias | `eg` | Egypt-biased geocoding |
| Tile format | Vector (MVT) | Smaller, styleable |
| Fallback tile format | Raster (PNG) | For older devices |

---

## 5. Customer Location System

### 5.1 Overview

Egyptian addresses are fundamentally different from Western addresses. Street numbers are rarely used; landmarks (mosques, pharmacies, supermarkets) are the primary reference points. The Customer Location System must embrace this reality.

### 5.2 Address Model

```
┌──────────────────────────────────────────────────┐
│              Customer Location                    │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────────────┐   ┌──────────────────────┐ │
│  │   GPS Coordinates│   │  Landmark Reference  │ │
│  │   lat: 30.0444   │   │  "Next to Al-Haram   │ │
│  │   lng: 31.2357   │   │   Mosque"            │ │
│  └─────────────────┘   └──────────────────────┘ │
│                                                  │
│  ┌─────────────────┐   ┌──────────────────────┐ │
│  │  Formal Address  │   │  Delivery Notes      │ │
│  │  15 Ahmed Orabi  │   │  "3rd floor, no      │ │
│  │  St, Dokki"      │   │   elevator"          │ │
│  └─────────────────┘   └──────────────────────┘ │
│                                                  │
│  ┌─────────────────┐   ┌──────────────────────┐ │
│  │  Building Detail │   │  Zone Assignment     │ │
│  │  Bldg 7, Floor 3 │   │  Dokki Zone A        │ │
│  │  Apt 12          │   │  Warehouse: Giza WH  │ │
│  └─────────────────┘   └──────────────────────┘ │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 5.3 Location Entity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Primary key |
| `customer_id` | UUID (FK) | Yes | Reference to customer |
| `label` | enum | Yes | `home`, `work`, `other` |
| `label_custom` | string | No | Custom label (e.g., "أمي") |
| `address_en` | string | Yes | English formal address |
| `address_ar` | string | Yes | Arabic formal address |
| `latitude` | decimal(10,7) | Yes | GPS latitude |
| `longitude` | decimal(10,7) | Yes | GPS longitude |
| `accuracy_meters` | integer | No | GPS accuracy in meters |
| `building_number` | string | No | Building number or name |
| `floor_number` | string | No | Floor number |
| `apartment_number` | string | No | Apartment/flat number |
| `landmark_en` | string | No | Nearby landmark (English) |
| `landmark_ar` | string | No | Nearby landmark (Arabic) |
| `delivery_notes` | text | No | Free-text delivery instructions |
| `zone_id` | UUID (FK) | No | Auto-assigned delivery zone |
| `warehouse_id` | UUID (FK) | No | Nearest warehouse (computed) |
| `is_default` | boolean | Yes | Default shipping address |
| `is_verified` | boolean | Yes | GPS pin confirmed by customer |
| `geocoded_at` | timestamp | No | When last geocoded |
| `created_at` | timestamp | Yes | Creation timestamp |
| `updated_at` | timestamp | Yes | Last update timestamp |

### 5.4 Address Validation Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Customer    │     │  Reverse     │     │  Zone        │
│  Pin Drop    │────▶│  Geocoding   │────▶│  Assignment  │
│  (GPS Coords)│     │  (Address)   │     │  (WH + Zone) │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │                    ▼                    ▼
       │            ┌──────────────┐     ┌──────────────┐
       │            │  Address     │     │  Delivery    │
       │            │  Suggestion  │     │  Fee Calc    │
       │            │  (Autofill)  │     │  (Zone-based)│
       │            └──────────────┘     └──────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│  Customer    │     │  Accuracy    │
│  Confirms    │────▶│  Check       │
│  Location    │     │  (±50m)      │
└──────────────┘     └──────────────┘
```

### 5.5 Address Validation Rules

| Rule | Condition | Action |
|------|-----------|--------|
| GPS accuracy | `accuracy_meters > 100` | Warn customer, request re-pin |
| Within coverage | Coordinates outside all zones | Show "We don't deliver here yet" |
| Duplicate detection | Same lat/lng within 50m of existing | Suggest existing saved address |
| Geocoding failure | Reverse geocode returns empty | Allow manual address entry |
| Building info missing | High-rise area detected | Prompt for floor/apartment |

### 5.6 Pin Drop Workflow

1. Customer opens map centered on their current GPS position
2. Map shows a draggable pin at detected location
3. Reverse geocoding fills address fields automatically
4. Customer can drag pin to adjust exact position
5. Customer fills apartment, floor, building, landmark
6. System validates: accuracy, coverage zone, nearest warehouse
7. Customer saves location with label (home/work/other)

### 5.7 Multiple Saved Addresses

| Feature | Behavior |
|---------|----------|
| Maximum saved addresses | 10 per customer |
| Default address | Exactly one; auto-set on first save |
| Address labels | Home (البيت), Work (الشغل), Other (أخرى) |
| Custom label | Free text, max 30 chars (Arabic or English) |
| Last used | Tracked for smart suggestion at checkout |
| Address sharing | Same customer, different phone numbers = shared |
| Edit existing | Full re-validation on save |
| Delete address | Soft delete, cannot delete default |

### 5.8 Reverse Geocoding Strategy

| Priority | Source | When Used |
|----------|--------|-----------|
| 1 | Google Maps Geocoding API | Production, best Egypt data |
| 2 | Mapbox Geocoding | Fallback if Google quota exceeded |
| 3 | Cached results | Redis cache, 30-day TTL |
| 4 | ERPNext warehouse zone polygon | If within known zone, use zone name |

### 5.9 Egyptian Address Quirks

| Quirk | How GGH Handles It |
|-------|-------------------|
| No street numbers | Landmark field is prominent, required on mobile |
| Neighborhood > Street | Area/neighborhood auto-detected from geocoding |
| "Behind the mosque" | Landmark field supports Arabic descriptions |
| New developments | Allow GPS-only with no formal address |
| Informal areas | Accept any GPS pin, validate coverage zone only |
| Arabic-only addresses | `address_ar` is primary; `address_en` is optional |

---

## 6. Warehouse Management

### 6.1 Warehouse Entity

Each warehouse in GGH is a physical facility with precise location data, coverage definitions, and operational parameters.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `code` | string | ERPNext warehouse code (e.g., "WH-GIZA-01") |
| `name_en` | string | English name |
| `name_ar` | string | Arabic name |
| `latitude` | decimal(10,7) | GPS latitude |
| `longitude` | decimal(10,7) | GPS longitude |
| `address_en` | string | Full English address |
| `address_ar` | string | Full Arabic address |
| `coverage_radius_km` | decimal | Default delivery radius |
| `coverage_polygon` | GeoJSON | Custom coverage area (overrides radius) |
| `region` | string | Administrative region (e.g., "Greater Cairo - Giza") |
| `is_active` | boolean | Currently operational |
| `operating_hours` | JSON | `{ "mon": {"open": "08:00", "close": "22:00"}, ... }` |
| `capacity_daily_orders` | integer | Maximum orders per day |
| `capacity_current_orders` | integer | Current order count today |
| `driver_count_active` | integer | Drivers currently on duty |
| `driver_count_total` | integer | Total assigned drivers |
| `inventory_value` | bigint (piastres) | Total inventory value |
| `temperature_controlled` | boolean | Has cold storage |
| `erp_warehouse_id` | string | ERPNext warehouse ID |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### 6.2 Warehouse Coverage Model

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│           ╭─────╮                                   │
│          ╱       ╲      Warehouse A                 │
│         ╱  WH-A   ╲    Coverage: 8 km              │
│        ╱    ●      ╲    Polygon: Custom             │
│        ╲           ╱    Region: Giza                │
│         ╲         ╱                                  │
│          ╲       ╱    ─ ─ ─ ─ ─ ─ ─ ─ ─           │
│           ╲     ╱     Overlap Zone (A ∩ B)          │
│            ╲   ╱      → Nearest WH wins             │
│             ╲ ╱       → Or inventory-available WH    │
│              X                                       │
│             ╱ ╲                                      │
│            ╱   ╲                                     │
│           ╱     ╲      Warehouse B                   │
│          ╱  WH-B  ╲    Coverage: 10 km              │
│         ╱    ●     ╲   Polygon: Custom              │
│         ╲          ╱   Region: Dokki/Mohandessin    │
│          ╲        ╱                                  │
│           ╲      ╱                                   │
│            ╲    ╱                                    │
│             ╲  ╱                                     │
│              ╲╱                                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 6.3 Warehouse Coverage Rules

| Rule | Logic |
|------|-------|
| Primary coverage | Warehouse polygon (GeoJSON) defines the boundary |
| Default coverage | If no polygon, use circular radius from GPS point |
| Overlap resolution | Multiple warehouses can cover same area; nearest with stock wins |
| Exclusion zones | Areas explicitly excluded from coverage (industrial, military) |
| Time-based coverage | Some zones have limited delivery hours |
| Priority | `priority` field on warehouse_zone table (1 = highest) |

### 6.4 Warehouse-Zone Mapping

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Warehouse   │────▶│  Zone        │────▶│  Region      │
│  (Physical)  │ 1:N │  (Coverage)  │ 1:1 │  (Admin)     │
└──────────────┘     └──────────────┘     └──────────────┘

Warehouse: WH-CAIRO-01
  └── Zone: Zamalek (polygon, priority 1)
  └── Zone: Garden City (polygon, priority 2)
  └── Zone: Downtown (polygon, priority 3)

Warehouse: WH-GIZA-01
  └── Zone: Dokki (polygon, priority 1)
  └── Zone: Mohandessin (polygon, priority 2)
  └── Zone: Agouza (polygon, priority 3)
```

### 6.5 Nearest Warehouse Calculation

| Method | Formula | Use Case |
|--------|---------|----------|
| Haversine distance | `d = 2R·arcsin(√(sin²(Δφ/2) + cos(φ1)cos(φ2)sin²(Δλ/2)))` | Straight-line distance |
| Driving distance | Maps Routing API | Actual road distance |
| Driving time | Maps Routing API with traffic | ETA-based selection |
| PostgreSQL `earthdistance` | `<->` operator with GiST index | Fast spatial queries |

### 6.6 Warehouse Performance Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Fulfillment rate | `orders_delivered / orders_assigned × 100` | ≥ 95% |
| Average delivery time | `avg(delivered_at - dispatched_at)` | ≤ 90 min |
| Inventory turnover | `COGS / avg_inventory` | ≥ 8/month |
| Driver utilization | `active_time / total_time × 100` | ≥ 75% |
| Order accuracy | `correct_orders / total_orders × 100` | ≥ 99% |
| Capacity utilization | `current_orders / daily_capacity × 100` | 60-85% |

### 6.7 Warehouse Heatmaps

| Heatmap Type | Data Source | Purpose |
|-------------|------------|---------|
| Order density | `delivery_assignments` aggregated by zone | Identify high-demand areas for new WH |
| Delivery time | `delivered_at - dispatched_at` by zone | Identify slow zones |
| Inventory level | ERP stock sync by WH | Rebalance inventory |
| Driver density | Live GPS positions | Driver distribution |
| Return rate | `return_orders` by zone | Quality issues by area |

---

## 7. Driver Management

### 7.1 Driver Entity

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `erp_driver_id` | string | ERPNext Employee/Driver ID |
| `name_en` | string | English name |
| `name_ar` | string | Arabic name |
| `phone` | string | Egyptian mobile (+20xxxxxxxxx) |
| `national_id` | string | Egyptian national ID (encrypted) |
| `license_number` | string | Driving license number |
| `license_expiry` | date | License expiration date |
| `vehicle_id` | UUID (FK) | Assigned vehicle |
| `warehouse_id` | UUID (FK) | Home warehouse |
| `status` | enum | `offline`, `online`, `busy`, `break`, `emergency` |
| `rating` | decimal(3,2) | Customer rating (1.00–5.00) |
| `total_deliveries` | integer | Lifetime delivery count |
| `on_time_rate` | decimal(5,2) | % of on-time deliveries |
| `avatar_url` | string | Profile photo URL |
| `is_active` | boolean | Employed and not suspended |
| `last_location_at` | timestamp | Last GPS ping time |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### 7.2 Driver Status State Machine

```
                    ┌──────────┐
          ┌────────▶│  offline │◀────────┐
          │         └────┬─────┘         │
          │              │ Login          │ Shift end
          │              ▼               │
          │         ┌──────────┐         │
          │    ┌───▶│  online  │◀───┐    │
          │    │    └────┬─────┘    │    │
          │    │         │ Assign   │    │
          │    │         ▼          │    │
          │    │    ┌──────────┐    │    │
          │    │    │   busy   │────┘    │
          │    │    └────┬─────┘ Complete│
          │    │         │              │
          │    │  ┌──────┤              │
          │    │  │      │              │
          │    ▼  ▼      │ Emergency    │
          │  ┌────────┐  │              │
          │  │ break  │  │              │
          │  └───┬────┘  │              │
          │      │Resume │              │
          └──────┘       ▼              │
                      ┌───────────┐     │
                      │ emergency │─────┘
                      └───────────┘
```

### 7.3 Driver GPS Tracking

| Data Point | Frequency | Purpose |
|------------|-----------|---------|
| Latitude | Every 2–5 seconds | Live tracking |
| Longitude | Every 2–5 seconds | Live tracking |
| Heading | Every 2–5 seconds | Direction arrow on map |
| Speed | Every 2–5 seconds | Speed limit alerts, ETA refinement |
| Accuracy | Every 2–5 seconds | Display confidence circle |
| Battery level | Every 30 seconds | Low battery alert |
| Network quality | Every 30 seconds | Predict GPS gaps |
| Timestamp | Every ping | Ordering, latency detection |

### 7.4 Driver Navigation Integration

| Integration | Method | Behavior |
|-------------|--------|----------|
| Google Maps | Deep link | `google.maps://?daddr=lat,lng&dirflg=d` |
| Apple Maps | Deep link | `maps://?daddr=lat,lng&dirflg=d` |
| Waze | Deep link | `waze://?ll=lat,lng&navigate=yes` |
| In-app navigation | Maps SDK | Embedded turn-by-turn (Phase 2) |

### 7.5 Emergency Mode

| Trigger | Action |
|---------|--------|
| Driver taps SOS button | Alert operations, share live location |
| No GPS ping for 5+ min while busy | Alert operations, call driver |
| Speed > 120 km/h | Log warning, alert if sustained |
| Driver reports accident | Lock route, send support, reassign orders |
| Device battery < 5% | Alert driver to charge, queue last known location |

---

## 8. Fleet Management

### 8.1 Vehicle Entity

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `erp_vehicle_id` | string | ERPNext Vehicle ID |
| `plate_number` | string | Egyptian plate number |
| `vehicle_type` | enum | `motorcycle`, `tricycle`, `van`, `truck` |
| `make` | string | Vehicle manufacturer |
| `model` | string | Vehicle model |
| `year` | integer | Model year |
| `capacity_weight_kg` | decimal | Maximum cargo weight |
| `capacity_volume_m3` | decimal | Maximum cargo volume |
| `fuel_type` | enum | `petrol`, `diesel`, `electric`, `cng` |
| `fuel_capacity_l` | decimal | Tank/battery capacity |
| `current_fuel_pct` | decimal(5,2) | Current fuel level % |
| `mileage_km` | integer | Odometer reading |
| `insurance_expiry` | date | Insurance expiration |
| `inspection_expiry` | date | Technical inspection expiration |
| `warehouse_id` | UUID (FK) | Home warehouse |
| `status` | enum | `available`, `in_use`, `maintenance`, `retired` |
| `gps_device_id` | string | External GPS tracker ID (if separate) |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### 8.2 Vehicle Type Classification

| Type | Capacity | Speed | Cost/km | Use Case |
|------|----------|-------|---------|----------|
| Motorcycle | 20 kg | Fast | Low | Small orders, express |
| Tricycle | 100 kg | Medium | Low-Med | Medium orders, narrow streets |
| Van | 500 kg | Medium | Medium | B2B bulk, wholesale |
| Truck | 2000 kg | Slow | High | Warehouse transfers, large B2B |

### 8.3 Fleet Dashboard Metrics

| Metric | Description | Visualization |
|--------|-------------|---------------|
| Active vehicles | Vehicles currently in service | Counter + trend |
| Vehicles by status | Available / In Use / Maintenance | Pie chart |
| Fleet utilization | Active time / Total time | Gauge |
| Fuel consumption | Liters per delivery | Line chart |
| Maintenance alerts | Vehicles due for service | Alert list |
| Distance traveled | Total km per day/week | Bar chart |
| Delivery capacity | Orders deliverable vs delivered | Progress bar |

### 8.4 Maintenance Schedule

| Maintenance Type | Interval | Alert Before |
|-----------------|----------|-------------|
| Oil change | Every 5,000 km | 500 km |
| Tire rotation | Every 10,000 km | 1,000 km |
| Brake inspection | Every 15,000 km | 1,500 km |
| Full service | Every 20,000 km | 2,000 km |
| Annual inspection | 12 months | 30 days |
| Insurance renewal | 12 months | 30 days |

---

## 9. Live Delivery Tracking

### 9.1 Tracking Experience Philosophy

The GGH tracking experience must match the expectations set by **Uber, Talabat, and DoorDash**. Egyptian consumers have been trained by ride-hailing and food delivery apps to expect:

1. **See the driver on a map in real time**
2. **Know the exact ETA**
3. **See the route the driver will take**
4. **Contact the driver with one tap**
5. **Know when the driver has arrived**

For **Om Ibrahim** (62, low tech comfort), the tracking must be **simpler than Uber**:
- Large text, large icons
- One status at a time (not multiple simultaneous updates)
- Clear Arabic: "السائق في الطريق" (Driver is on the way)
- One button to call the driver

### 9.2 Order Timeline States

| State | Arabic | What Customer Sees |
|-------|--------|--------------------|
| `placed` | تم الطلب | "Order confirmed, finding driver" |
| `assigned` | تم تعيين السائق | Driver name + photo + vehicle |
| `picking_up` | جاري التحضير | "Driver is at the warehouse" |
| `on_the_way` | في الطريق | **Live map** with driver moving |
| `nearby` | قريب منك | "Driver is 2 minutes away" + notification |
| `arrived` | وصل السائق | "Driver has arrived!" + call button |
| `delivering` | جاري التسليم | "Handing over your order" |
| `delivered` | تم التسليم | "Delivered! ✅" + proof photo |
| `failed` | فشل التسليم | "Delivery failed" + reason + retry |

### 9.3 Tracking Data Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Tracking Session                       │
│                                                         │
│  order_id: "ord_abc123"                                 │
│  driver_id: "drv_xyz789"                                │
│  status: "on_the_way"                                   │
│  started_at: 2025-07-11T14:30:00+02:00                  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  GPS Stream (Redis Sorted Set)                   │    │
│  │  key: "track:{order_id}"                         │    │
│  │  score: timestamp                                │    │
│  │  value: {lat, lng, heading, speed, accuracy}    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Events List                                     │    │
│  │  [{status, timestamp, location, metadata}]       │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Route Polyline                                  │    │
│  │  Encoded polyline from WH to customer            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ETA                                             │    │
│  │  current_eta: 14 min                             │    │
│  │  eta_updated_at: 2025-07-11T14:35:00+02:00       │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 9.4 Customer-Visible Driver Information

| Data | When Visible | Format |
|------|-------------|--------|
| Driver name | After assignment | Arabic name, large text |
| Driver photo | After assignment | Avatar image, 64px |
| Vehicle type | After assignment | Icon + text (e.g., "🛺 تريسيكل") |
| Vehicle plate | After assignment | Large text, contrast background |
| Driver phone | After assignment | Call button (green, 48px touch) |
| WhatsApp | After assignment | WhatsApp button (green, 48px touch) |
| Current ETA | After pickup | "١٤ دقيقة" (Arabic numerals) |
| Distance | After pickup | "٢.٣ كم" |

### 9.5 ETA Calculation Model

| Factor | Weight | Source |
|--------|--------|--------|
| Straight-line distance | 10% | Haversine formula |
| Road distance | 30% | Maps Routing API |
| Current traffic | 30% | Maps Traffic API |
| Historical average | 20% | PostgreSQL `delivery_events` |
| Driver speed profile | 10% | Last 50 deliveries by this driver |

ETA is recalculated every 15 seconds using the latest GPS position and traffic data.

### 9.6 Proof of Delivery

| Method | Required | Data Captured |
|--------|----------|---------------|
| GPS confirmation | Yes | Driver GPS within 50m of customer location |
| Customer signature | No (optional) | Signature image on driver device |
| Delivery photo | Yes | Photo of delivered items at doorstep |
| OTP verification | For COD > 500 EGP | 4-digit code from customer |
| Barcode scan | For B2B orders | Scan of order barcode |

---

## 10. ERPNext Integration

### 10.1 ERPNext as Location Source of Truth

ERPNext owns the canonical data for physical-world entities. GGH reads this data and enhances it with real-time tracking.

| Entity | ERPNext Doctype | GGH Enhancement |
|--------|----------------|-----------------|
| Warehouse | `Warehouse` | GPS coordinates, coverage polygon, heatmap data |
| Driver | `Employee` (Driver category) | Live GPS, status, rating, delivery history |
| Vehicle | `Vehicle` (custom) | GPS tracker, fuel, maintenance schedule |
| Delivery Trip | `Delivery Trip` | Live tracking session, ETA, route polyline |
| Stock Entry | `Stock Entry` | Transfer route, distance, cost |
| Address | `Address` | GPS pin, zone assignment, landmark |
| Customer | `Customer` | Saved locations, delivery preferences |

### 10.2 ERPNext Location Data Sync

```
┌─────────────────────────────────────────────────────────┐
│                  Sync Direction Map                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ERPNext ──────▶ GGH (Pull)                             │
│  • Warehouse locations                                  │
│  • Driver records                                       │
│  • Vehicle records                                      │
│  • Delivery schedules                                   │
│  • Stock levels (per warehouse)                         │
│  • Address book                                         │
│                                                         │
│  GGH ──────▶ ERPNext (Push)                             │
│  • Delivery trip updates (status, GPS, ETA)            │
│  • Proof of delivery (photo, signature)                │
│  • Driver location events                               │
│  • Route history                                        │
│  • Delivery KPIs                                        │
│  • Customer location updates                            │
│                                                         │
│  Bidirectional                                          │
│  • Customer addresses (ERP owns, GGH enhances)         │
│  • Driver availability (ERP schedules, GGH live status)│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 10.3 BullMQ Sync Queues

| Queue | Direction | Frequency | Priority |
|-------|-----------|-----------|----------|
| `erp.sync.warehouses` | Pull | Every 10 min | Medium |
| `erp.sync.drivers` | Pull | Every 15 min | Medium |
| `erp.sync.vehicles` | Pull | Every 30 min | Low |
| `erp.sync.stock` | Pull | Every 5 min | High |
| `erp.push.delivery_status` | Push | On event | High |
| `erp.push.proof_of_delivery` | Push | On event | High |
| `erp.push.driver_location` | Push | Every 5 min | Low |
| `erp.push.customer_location` | Push | On save | Medium |

### 10.4 ERPNext Custom Fields for Location

| Doctype | Custom Field | Type | Purpose |
|---------|-------------|------|---------|
| `Warehouse` | `ggh_latitude` | Float | GPS latitude |
| `Warehouse` | `ggh_longitude` | Float | GPS longitude |
| `Warehouse` | `ggh_coverage_radius_km` | Float | Delivery coverage |
| `Warehouse` | `ggh_coverage_polygon` | Code (GeoJSON) | Custom coverage area |
| `Warehouse` | `ggh_daily_capacity` | Int | Max daily orders |
| `Employee` | `ggh_is_driver` | Check | Mark as driver |
| `Employee` | `ggh_driver_status` | Select | online/offline/busy |
| `Employee` | `ggh_warehouse` | Link (Warehouse) | Home warehouse |
| `Employee` | `ggh_vehicle` | Link (Vehicle) | Assigned vehicle |
| `Address` | `ggh_latitude` | Float | GPS latitude |
| `Address` | `ggh_longitude` | Float | GPS longitude |
| `Address` | `ggh_landmark_en` | Data | Landmark (English) |
| `Address` | `ggh_landmark_ar` | Data | Landmark (Arabic) |
| `Address` | `ggh_zone` | Link (Delivery Zone) | Assigned zone |

### 10.5 Delivery Trip Lifecycle in ERPNext

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Draft   │───▶│ Scheduled│───▶│ In Transit│───▶│ Completed│
└─────────┘    └──────────┘    └──────────┘    └──────────┘
                                     │
                                     ▼
                               ┌──────────┐
                               │ Cancelled│
                               └──────────┘

GGH enhances each state with:
  Draft     → Warehouse selection, route preview
  Scheduled → Driver assignment, ETA calculation
  In Transit→ Live GPS, route tracking, geofence events
  Completed → Proof of delivery, distance traveled, duration
  Cancelled → Reason, reassignment trigger
```

### 10.6 Inventory Transfer Routing

When stock is rebalanced between warehouses:

| Step | System | Action |
|------|--------|--------|
| 1 | ERPNext | Create `Stock Entry` (Material Transfer) |
| 2 | GGH Location Service | Calculate optimal route between warehouses |
| 3 | GGH Location Service | Assign driver/vehicle for transfer |
| 4 | Driver App | Show transfer route with navigation |
| 5 | GGH Location Service | Track transfer like a delivery |
| 6 | ERPNext | Update stock levels upon arrival confirmation |
| 7 | GGH Analytics | Log transfer distance, time, cost |

---

## 11. Warehouse Selection Logic

### 11.1 Selection Algorithm

When a customer places an order, the system must determine which warehouse will fulfill it. This is a multi-factor optimization:

```
┌─────────────────────────────────────────────────────────┐
│              Warehouse Selection Pipeline                │
│                                                         │
│  Input: Customer Location + Order Items                 │
│                                                         │
│  Step 1: FILTER                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Find all warehouses whose coverage zone         │   │
│  │  contains the customer's GPS coordinates        │   │
│  └─────────────────────────────────────────────────┘   │
│                    │                                    │
│                    ▼                                    │
│  Step 2: INVENTORY CHECK                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Eliminate warehouses that don't have ALL        │   │
│  │  order items in stock                            │   │
│  └─────────────────────────────────────────────────┘   │
│                    │                                    │
│                    ▼                                    │
│  Step 3: CAPACITY CHECK                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Eliminate warehouses at daily capacity limit    │   │
│  └─────────────────────────────────────────────────┘   │
│                    │                                    │
│                    ▼                                    │
│  Step 4: DRIVER CHECK                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Eliminate warehouses with no available drivers  │   │
│  └─────────────────────────────────────────────────┘   │
│                    │                                    │
│                    ▼                                    │
│  Step 5: SCORE & RANK                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Score remaining warehouses by:                   │   │
│  │  - Distance (40%)                                │   │
│  │  - Driving time with traffic (30%)               │   │
│  │  - Current load (15%)                            │   │
│  │  - Historical delivery time (15%)                │   │
│  └─────────────────────────────────────────────────┘   │
│                    │                                    │
│                    ▼                                    │
│  Output: Best warehouse (or fallback list)              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 11.2 Scoring Formula

```
score = w_distance × normalize(distance) +
        w_time    × normalize(driving_time) +
        w_load    × normalize(current_orders / daily_capacity) +
        w_history × normalize(avg_delivery_time)

Where:
  w_distance = 0.40
  w_time     = 0.30
  w_load     = 0.15
  w_history  = 0.15

normalize(x) = (max - x) / (max - min)    # Lower is better → inverted
```

### 11.3 Fallback Strategy

| Condition | Fallback |
|-----------|----------|
| No warehouse in coverage | Show "Not available in your area" |
| Warehouse in coverage, no stock | Find nearest WH with stock, offer longer ETA |
| All WH at capacity | Queue order, show "Delivery tomorrow" |
| No drivers available | Queue until driver becomes available |
| GPS unavailable | Use zone-based warehouse assignment |

### 11.4 Distance Calculation Methods

| Method | Accuracy | Speed | Use Case |
|--------|----------|-------|----------|
| PostgreSQL `<->` GiST index | Low (straight line) | Very fast | Initial filtering |
| Haversine formula | Low (great circle) | Fast | Rough distance display |
| Maps Routing API (no traffic) | High (road distance) | Slow | Exact distance |
| Maps Routing API (with traffic) | Very high | Slowest | ETA-based selection |

**Strategy**: Use PostgreSQL spatial index for initial filtering (Step 1), then Maps Routing API for final scoring (Step 5).

---

## 12. Delivery Assignment Engine

### 12.1 Assignment Methods

| Method | When Used | Logic |
|--------|-----------|-------|
| **Automatic** | Default | Nearest available driver with capacity |
| **Manual** | VIP/B2B orders | Operations manager selects driver |
| **AI-assisted** | Phase 2+ | ML model predicts best driver based on history |
| **Round-robin** | Fair distribution | Rotate through available drivers equally |
| **Zone-based** | High volume | Driver already in the area gets priority |

### 12.2 Automatic Assignment Algorithm

```
┌─────────────────────────────────────────────────────────┐
│              Automatic Assignment Engine                  │
│                                                         │
│  Input: Order + Warehouse                               │
│                                                         │
│  Step 1: Find eligible drivers                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  • Status = "online" or "busy" (near complete)  │   │
│  │  • Home warehouse = order warehouse              │   │
│  │  • Vehicle capacity ≥ order weight               │   │
│  │  • Current active orders < max (typically 3)     │   │
│  │  • Not on break/emergency                        │   │
│  └─────────────────────────────────────────────────┘   │
│                    │                                    │
│                    ▼                                    │
│  Step 2: Score drivers                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Score = f(proximity, load, rating, idle_time)   │   │
│  │                                                   │   │
│  │  proximity (40%): GPS distance to warehouse       │   │
│  │  load (25%): current_orders / max_orders          │   │
│  │  rating (20%): driver customer rating             │   │
│  │  idle_time (15%): time since last delivery        │   │
│  └─────────────────────────────────────────────────┘   │
│                    │                                    │
│                    ▼                                    │
│  Step 3: Assign top driver                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  • Send push notification to driver               │   │
│  │  • Wait 30 seconds for acceptance                 │   │
│  │  • If rejected/timeout, try next driver           │   │
│  │  • If no driver accepts, escalate to ops team     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 12.3 Priority Order Handling

| Priority | Condition | Assignment Rule |
|----------|-----------|-----------------|
| P0 (Emergency) | Customer complaint redelivery | Immediate, any available driver |
| P1 (Express) | Express delivery paid | Nearest driver, max 1 active order |
| P2 (B2B) | Business account order | Dedicated B2B driver, time window |
| P3 (Standard) | Regular order | Normal assignment algorithm |
| P4 (Scheduled) | Future delivery window | Assign at window start |

### 12.4 Multi-Stop Route Grouping

When a driver has multiple orders for the same area:

```
┌──────────────────────────────────────────────────────┐
│  Warehouse (Start)                                    │
│    │                                                  │
│    ├──▶ Stop 1: Customer A (2.5 km)                  │
│    │       └── Drop: Rice 5kg, Oil 1L               │
│    │                                                  │
│    ├──▶ Stop 2: Customer B (1.2 km from A)           │
│    │       └── Drop: Pasta, Sugar                    │
│    │                                                  │
│    └──▶ Stop 3: Customer C (0.8 km from B)           │
│            └── Drop: Tea, Coffee                     │
│                                                      │
│  Total: 4.5 km, ~25 min                              │
│  vs. 3 separate trips: 12 km, ~60 min               │
│  Savings: 63% distance, 58% time                     │
└──────────────────────────────────────────────────────┘
```

### 12.5 Load Balancing

| Strategy | Description | When Active |
|----------|-------------|-------------|
| Proximity-first | Closest driver gets the order | Default |
| Fair distribution | Rotate through drivers evenly | Low volume periods |
| Performance-weighted | Better-rated drivers get more orders | High volume |
| Zone-lock | Each driver "owns" a sub-zone | Peak hours |

---

## 13. Route Optimization

### 13.1 Route Computation Pipeline

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Order List  │────▶│  Clustering  │────▶│  Sequencing  │
│  (N stops)   │     │  (Group by   │     │  (TSP solve) │
│              │     │   area)      │     │              │
└─────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                ▼
                    ┌──────────────┐     ┌──────────────┐
                    │  Final Route │◀────│  Refinement  │
                    │  (Ordered    │     │  (Traffic,   │
                    │   stops)     │     │   closures)  │
                    └──────────────┘     └──────────────┘
```

### 13.2 Optimization Objectives

| Objective | Weight | Metric |
|-----------|--------|--------|
| Minimize total distance | 35% | Sum of segment distances |
| Minimize total time | 30% | Sum of segment driving times |
| Meet time windows | 20% | % of stops within promised window |
| Balance driver load | 10% | Std dev of orders per driver |
| Minimize fuel cost | 5% | Estimated fuel consumption |

### 13.3 Multi-Stop Optimization (Traveling Salesman Problem)

For N delivery stops, the number of possible routes is N! (factorial).

| Stops | Possible Routes | Approach |
|-------|----------------|----------|
| 1–5 | ≤ 120 | Brute force (exact) |
| 6–10 | ≤ 3,628,800 | 2-opt heuristic |
| 11–20 | Astronomical | Or-opt heuristic + Maps API |
| 20+ | Intractable | Cluster → solve clusters → link |

### 13.4 Dynamic Rerouting Triggers

| Trigger | Action |
|---------|--------|
| New order added to driver's route | Re-sequence remaining stops |
| Traffic incident on planned route | Recalculate route avoiding incident |
| Customer cancels | Remove stop, re-sequence |
| Driver takes wrong turn | Re-route from current position |
| Delivery takes longer than expected | Adjust ETA for remaining stops |
| Road closure detected | Re-route all affected drivers |

### 13.5 Route Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Route efficiency | ≥ 85% | Actual distance / Optimal distance |
| On-time delivery | ≥ 90% | Arrived within promised window |
| Idle time | ≤ 10% | Time stationary / Total route time |
| Fuel efficiency | ≤ 110% | Actual fuel / Expected fuel for route |

---

## 14. Geofencing

### 14.1 Geofence Types

| Type | Shape | Trigger | Action |
|------|-------|---------|--------|
| Warehouse arrival | Circle (200m) | Driver enters | Log pickup start |
| Warehouse departure | Circle (200m) | Driver exits | Log pickup complete, start tracking |
| Customer arrival | Circle (50m) | Driver enters | Notify customer "Driver arrived" |
| Customer departure | Circle (50m) | Driver exits | Log delivery attempt |
| Zone boundary | Polygon | Driver crosses | Update driver's current zone |
| Restricted area | Polygon | Driver enters | Alert operations, flag violation |
| Speed zone | Polygon | Speed > limit | Log speed violation |

### 14.2 Geofence Event Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  GPS Update  │────▶│  Point-in-   │────▶│  Event       │
│  (lat, lng)  │     │  Polygon     │     │  Detection   │
│              │     │  Check       │     │  (Enter/Exit)│
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                    ┌───────────┼───────────┐
                                    │           │           │
                                    ▼           ▼           ▼
                            ┌──────────┐ ┌──────────┐ ┌──────────┐
                            │ Update   │ │ Send     │ │ Log to   │
                            │ Order    │ │ Push     │ │ Database │
                            │ Status   │ │ Notif    │ │          │
                            └──────────┘ └──────────┘ └──────────┘
```

### 14.3 Geofence Detection Algorithm

For performance, use a **two-stage check**:

1. **Bounding box pre-filter** (fast): Check if GPS point is within the axis-aligned bounding box of any geofence
2. **Ray-casting algorithm** (accurate): For candidate geofences, use point-in-polygon test

| Geofences | Naive O(N) | With Bounding Box | With Spatial Index |
|-----------|-----------|-------------------|-------------------|
| 10 | 10 checks | ~3 checks | ~2 checks |
| 100 | 100 checks | ~10 checks | ~3 checks |
| 1,000 | 1,000 checks | ~30 checks | ~4 checks |

### 14.4 Delivery Zone Geofences

```
┌─────────────────────────────────────────────────────────┐
│              Greater Cairo Delivery Zones                 │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Zone N1    │  │  Zone N2    │  │  Zone N3    │    │
│  │  Nasr City  │  │  Heliopolis │  │  New Cairo  │    │
│  │  WH: NC-01  │  │  WH: HP-01  │  │  WH: NC-02  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Zone C1    │  │  Zone C2    │  │  Zone G1    │    │
│  │  Downtown   │  │  Zamalek    │  │  Giza       │    │
│  │  WH: CC-01  │  │  WH: CC-01  │  │  WH: GZ-01  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐                      │
│  │  Zone G2    │  │  Zone G3    │                      │
│  │  Dokki      │  │  6th October│                      │
│  │  WH: GZ-01  │  │  WH: OC-01  │                      │
│  └─────────────┘  └─────────────┘                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 14.5 Geofence Notification Rules

| Event | Recipient | Channel | Template |
|-------|-----------|---------|----------|
| Driver enters warehouse | Warehouse manager | Dashboard alert | "Driver [name] arrived at WH" |
| Driver exits warehouse | Customer | Push notification | "Your order is on the way!" |
| Driver enters customer zone (500m) | Customer | Push notification | "Driver is nearby, ~2 min" |
| Driver at customer door | Customer | Push + SMS + call | "Driver has arrived!" |
| Driver enters restricted area | Operations | Dashboard alert + SMS | "ALERT: Driver in restricted zone" |
| Driver exceeds speed | Operations | Log only | Speed violation recorded |

---

## 15. Live GPS Streaming

### 15.1 GPS Data Format

Each GPS ping from a driver device contains:

```json
{
  "driver_id": "drv_abc123",
  "order_id": "ord_xyz789",
  "timestamp": "2025-07-11T14:35:22.000Z",
  "latitude": 30.0444200,
  "longitude": 31.2357100,
  "accuracy": 12,
  "heading": 245.5,
  "speed": 38.2,
  "battery_level": 72,
  "network_type": "4G",
  "session_id": "ses_track001"
}
```

| Field | Type | Unit | Frequency |
|-------|------|------|-----------|
| `latitude` | decimal(10,7) | degrees | Every 2–5s |
| `longitude` | decimal(10,7) | degrees | Every 2–5s |
| `accuracy` | integer | meters | Every 2–5s |
| `heading` | decimal(5,1) | degrees (0–360) | Every 2–5s |
| `speed` | decimal(5,1) | km/h | Every 2–5s |
| `battery_level` | integer | % | Every 30s |
| `network_type` | enum | 2G/3G/4G/5G/WiFi | Every 30s |

### 15.2 Communication Approach Comparison

| Criterion | WebSocket (Socket.io) | Server-Sent Events | Long Polling | Short Polling |
|-----------|----------------------|--------------------|--------------|---------------|
| **Direction** | Bidirectional | Server → Client only | Client pulls | Client pulls |
| **Latency** | < 100ms | < 200ms | 1–5s | 5–30s |
| **Scalability** | High (with Redis adapter) | Very High | Medium | Low |
| **Battery impact (mobile)** | Medium | Low | High | High |
| **Connection overhead** | Persistent | Persistent | New per request | New per request |
| **Firewall traversal** | Good (HTTP upgrade) | Excellent (HTTP) | Excellent | Excellent |
| **Binary support** | Yes | No | No | No |
| **Browser support** | All modern | All | All | All |
| **Implementation complexity** | Medium | Low | Low | Very Low |
| **Best for** | Driver ↔ Server, Customer tracking | Customer tracking only | Fallback only | Legacy fallback |

### 15.3 Recommended Architecture

**Use Socket.io for all real-time communication**, with SSE as a fallback:

```
┌──────────────┐                      ┌──────────────┐
│  Driver App  │◀──── Socket.io ────▶│  Location    │
│  (Mobile)    │     (bidirectional)  │  Service     │
└──────────────┘                      │  (Port 3004) │
                                      │              │
┌──────────────┐     ┌──────────┐     │              │
│  Customer    │◀───▶│  BFF     │◀───▶│              │
│  Browser     │SSE  │  (3000)  │Socket│              │
└──────────────┘     └──────────┘     └──────┬───────┘
                                               │
                                      ┌────────▼────────┐
                                      │     Redis       │
                                      │  Pub/Sub +      │
                                      │  Sorted Sets    │
                                      └─────────────────┘
```

### 15.4 GPS Data Flow

```
Driver Phone              Location Service           Redis              Customer Browser
     │                         │                       │                      │
     │──GPS ping (2s)─────────▶│                       │                      │
     │                         │──ZADD track:{oid}────▶│                      │
     │                         │──PUBLISH gps:{drv_id}─▶│                      │
     │                         │                       │──BFF subscribes──────│
     │                         │                       │                      │
     │──GPS ping (4s)─────────▶│                       │                      │
     │                         │──ZADD track:{oid}────▶│                      │
     │                         │──PUBLISH gps:{drv_id}─▶│────SSE push────────▶│
     │                         │                       │                      │
     │──GPS ping (6s)─────────▶│                       │                      │
     │                         │──ZADD track:{oid}────▶│                      │
     │                         │──PUBLISH gps:{drv_id}─▶│────SSE push────────▶│
```

### 15.5 GPS Throttling & Batching

| Scenario | GPS Interval | Rationale |
|----------|-------------|-----------|
| Driver active on delivery | 2 seconds | Smooth live tracking |
| Driver online, no delivery | 10 seconds | Monitor availability |
| Driver stationary (> 2 min) | 30 seconds | Save battery |
| Driver on break | 60 seconds | Minimal tracking |
| Low battery (< 15%) | 15 seconds | Preserve battery while still tracking |
| No network | Queue locally | Batch send on reconnect |

### 15.6 Offline GPS Handling

```
┌─────────────────────────────────────────────────────────┐
│              Offline GPS Queue on Driver Device          │
│                                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│  │ 2s  │ │ 4s  │ │ 6s  │ │ 8s  │ │ 10s │ │ 12s │    │
│  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘    │
│     │       │       │       │       │       │         │
│     ▼       ▼       ▼       ▼       ▼       ▼         │
│  ┌─────────────────────────────────────────────┐       │
│  │           Local SQLite Queue                 │       │
│  │  Max: 500 pings (≈ 16 min at 2s intervals)  │       │
│  └──────────────────┬──────────────────────────┘       │
│                     │ Network restored                  │
│                     ▼                                   │
│  ┌─────────────────────────────────────────────┐       │
│  │  Batch POST to /api/v1/gps/batch             │       │
│  │  Server replays pings with timestamps         │       │
│  └─────────────────────────────────────────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 16. Customer Tracking Page

### 16.1 UI Wireframe — Desktop

```
┌─────────────────────────────────────────────────────────────┐
│  ◀ Back to Orders    Order #GH-12345    تتبع طلبك          │
├──────────────────────────────┬──────────────────────────────┤
│                              │                              │
│                              │  Order Status                │
│                              │  ┌────────────────────────┐  │
│       LIVE MAP               │  │ ✅ تم الطلب            │  │
│                              │  │ ✅ تم التعيين           │  │
│    [Driver Icon]             │  │ ✅ جاري التحضير        │  │
│       │                      │  │ 🔵 في الطريق ← now    │  │
│       │ route                │  │ ○ قريب منك             │  │
│       │                      │  │ ○ وصل السائق           │  │
│       ▼                      │  │ ○ تم التسليم           │  │
│    [Home Icon]               │  └────────────────────────┘  │
│                              │                              │
│                              │  ETA                        │
│                              │  ┌────────────────────────┐  │
│                              │  │   ١٤ دقيقة             │  │
│                              │  │   ٢.٣ كم              │  │
│                              │  └────────────────────────┘  │
│                              │                              │
│                              │  Driver                     │
│                              │  ┌────────────────────────┐  │
│                              │  │ [Photo] أحمد محمد      │  │
│                              │  │ 🛺 تريسيكل · ٣٤٥ س ع  │  │
│                              │  │ [📞 اتصل] [💬 واتساب]  │  │
│                              │  └────────────────────────┘  │
│                              │                              │
│                              │  Order Details              │
│                              │  ┌────────────────────────┐  │
│                              │  │ أرز ممتاز 5كيلو × 1   │  │
│                              │  │ زيت طعام 1لتر × 2     │  │
│                              │  │ الإجمالي: ٢٢٩ ج.م     │  │
│                              │  └────────────────────────┘  │
│                              │                              │
│                              │  [🆘 المساعدة]              │
└──────────────────────────────┴──────────────────────────────┘
```

### 16.2 UI Wireframe — Mobile

```
┌────────────────────────────┐
│  ◀  Order #GH-12345        │
│                            │
│  ┌────────────────────────┐│
│  │                        ││
│  │      LIVE MAP          ││
│  │   [Driver] ──▶ [Home]  ││
│  │                        ││
│  └────────────────────────┘│
│                            │
│  ┌────────────────────────┐│
│  │ 🔵 في الطريق           ││
│  │ ١٤ دقيقة · ٢.٣ كم     ││
│  └────────────────────────┘│
│                            │
│  ┌────────────────────────┐│
│  │ [Photo] أحمد محمد      ││
│  │ 🛺 ٣٤٥ س ع             ││
│  │ [📞 اتصل] [💬 واتساب]  ││
│  └────────────────────────┘│
│                            │
│  Timeline                  │
│  ✅ تم الطلب  ١٢:٣٠       │
│  ✅ تم التعيين ١٢:٣٢      │
│  🔵 في الطريق ١٢:٤٥      │
│  ○ قريب منك               │
│  ○ تم التسليم             │
│                            │
│  [🆘 المساعدة]             │
└────────────────────────────┘
```

### 16.3 Tracking Page Components

| Component | Priority | Description |
|-----------|----------|-------------|
| Live map | P0 | Driver position updating every 2–5s |
| Order status | P0 | Current state with Arabic text |
| ETA card | P0 | Minutes + distance to delivery |
| Driver card | P0 | Name, photo, vehicle, call/WhatsApp |
| Timeline | P1 | Vertical timeline of all status changes |
| Order details | P1 | Items, quantities, total |
| Support button | P1 | Open help chat or call support |
| Route polyline | P2 | Driver's planned route on map |
| Delivery proof | P2 | Photo after delivery (expandable) |

### 16.4 Tracking Page Accessibility (Elder-Friendly)

| Requirement | Implementation |
|-------------|---------------|
| Large status text | Minimum 24px for status, 48px for ETA |
| High contrast | White card on map, dark text on light background |
| Simple language | Arabic-only for Om Ibrahim, no jargon |
| One action at a time | Call button OR WhatsApp, not both visible |
| Audio notifications | "السائق في الطريق" voice alert (optional) |
| Big touch targets | All buttons ≥ 56px for elderly users |
| Auto-refresh | No manual refresh, live updates |
| Clear driver identification | Photo + name + plate, always visible |

---

## 17. Admin Dashboard

### 17.1 Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  GGH Operations    [Live] [Today] [This Week]    🔔 3 alerts   │
├─────────┬───────────────────────────────────────────────────────┤
│         │                                                       │
│ Sidebar │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│         │  │ Active Orders│ │ Active Drivers│ │  On-Time %   │  │
│ Fleet   │  │     47       │ │     23/35     │ │    91.2%     │  │
│ WH      │  └──────────────┘ └──────────────┘ └──────────────┘  │
│ Orders  │                                                       │
│ Drivers │  ┌─────────────────────────────────────────────────┐  │
│ Zones   │  │                                                  │  │
│ Alerts  │  │              LIVE FLEET MAP                      │  │
│ Reports │  │                                                  │  │
│         │  │   [D1] [D2]      [D3]                          │  │
│         │  │         \         /                              │  │
│         │  │     [WH-A]●    [WH-B]●                         │  │
│         │  │        \  /      \  /                            │  │
│         │  │         \/        \/                             │  │
│         │  │    [D4] [D5]  [D6] [D7]                        │  │
│         │  │                                                  │  │
│         │  └─────────────────────────────────────────────────┘  │
│         │                                                       │
│         │  ┌──────────────────┐ ┌──────────────────────────┐   │
│         │  │ Orders by Zone   │ │ Delivery Time Dist       │   │
│         │  │ [Bar Chart]      │ │ [Histogram]              │   │
│         │  └──────────────────┘ └──────────────────────────┘   │
│         │                                                       │
│         │  ┌─────────────────────────────────────────────────┐  │
│         │  │  Recent Alerts                                   │  │
│         │  │  ⚠ Driver Ahmed - no GPS for 8 min             │  │
│         │  │  ⚠ WH-Giza at 92% capacity                      │  │
│         │  │  ⚠ Zone Dokki - 3 delayed orders                │  │
│         │  └─────────────────────────────────────────────────┘  │
│         │                                                       │
└─────────┴───────────────────────────────────────────────────────┘
```

### 17.2 Admin Dashboard Metrics

| Metric | Data Source | Refresh Rate |
|--------|-----------|--------------|
| Active orders count | `delivery_assignments` | Real-time |
| Active drivers count | `drivers` (status = online/busy) | Real-time |
| On-time delivery rate | `delivery_events` | 5 min |
| Average delivery time | `delivery_events` | 5 min |
| Orders by zone | `delivery_assignments` + `zones` | 1 min |
| Fleet utilization | GPS data + driver status | 1 min |
| Warehouse capacity | ERP sync | 5 min |
| Customer wait time | `orders` → assigned time | 1 min |

### 17.3 Admin Map Layers

| Layer | Toggle | Purpose |
|-------|--------|---------|
| Driver positions | On/Off | Live GPS dots on map |
| Driver routes | On/Off | Active route polylines |
| Warehouse markers | Always on | WH locations with capacity indicators |
| Zone boundaries | On/Off | Delivery zone polygons |
| Order clusters | On/Off | Heatmap of pending orders |
| Traffic overlay | On/Off | Real-time traffic colors |
| Geofence boundaries | On/Off | Warehouse/customer geofences |
| Incident markers | Always on | Accidents, road closures |

### 17.4 Alert System

| Alert | Severity | Trigger | Recipient |
|-------|----------|---------|-----------|
| Driver no GPS | High | No ping for 5+ min while busy | Ops manager |
| Warehouse at capacity | Medium | Current orders ≥ 90% capacity | WH manager |
| Delivery delayed | Medium | ETA exceeded by 15+ min | Ops manager + Customer |
| Speed violation | Low | Speed > 100 km/h | Ops log |
| Geofence violation | High | Driver enters restricted area | Ops manager |
| Fuel low | Low | Vehicle fuel < 15% | Fleet manager |
| License expiring | Low | Within 30 days of expiry | Fleet manager |

---

## 18. Warehouse Dashboard

### 18.1 Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  WH-Giza-01    [Live]           📊 Today's Performance   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Pending  │ │ Picking  │ │ In Route │ │ Delivered│  │
│  │   12     │ │    8     │ │    15    │ │    31    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │               WAREHOUSE MAP                      │   │
│  │                                                  │   │
│  │    [D1] → Customer     [D2] → Customer           │   │
│  │         ● WH-Giza-01                             │   │
│  │    [D3] → Customer     [D4] → Customer           │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────┐ ┌──────────────────────────┐  │
│  │  Driver Status       │ │  Stock Alerts             │  │
│  │  🟢 Online: 8       │ │  ⚠ Rice 5kg: 12 left     │  │
│  │  🔵 Busy: 5         │ │  ⚠ Cooking Oil: 8 left   │  │
│  │  🟡 Break: 2        │ │  ✅ Pasta: 45 units       │  │
│  │  ⚫ Offline: 3       │ │  ✅ Sugar: 60 units       │  │
│  └──────────────────────┘ └──────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Upcoming Transfers                              │   │
│  │  WH-Cairo → WH-Giza: Rice 5kg (50 units) 14:00 │   │
│  │  WH-Giza → WH-Dokki: Oil 1L (30 units) 16:00   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 18.2 Warehouse Dashboard Data

| Section | Data | Refresh |
|---------|------|---------|
| Order pipeline counts | Orders by status | Real-time |
| Warehouse map | Driver positions, route lines | Real-time |
| Driver status | Online/busy/break/offline | Real-time |
| Stock alerts | Items below reorder point | 5 min (ERP sync) |
| Transfer schedule | Pending `Stock Entry` from ERP | 10 min |
| Capacity gauge | Current orders / daily capacity | 1 min |
| Average delivery time | Last 50 deliveries | 5 min |

---

## 19. Mobile Driver Interface

### 19.1 Driver App Screens

```
┌──────────────────────┐
│                      │
│   Driver Login       │
│   ┌──────────────┐   │
│   │ 📱 Phone #   │   │
│   │ [__________] │   │
│   │              │   │
│   │ 🔑 OTP      │   │
│   │ [____]       │   │
│   │              │   │
│   │ [تسجيل دخول] │   │
│   └──────────────┘   │
│                      │
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Shift Start         │
│  ┌──────────────┐    │
│  │ [ابدأ الشفت]  │    │
│  │              │    │
│  │ WH: جيزة-01  │    │
│  │ Vehicle:     │    │
│  │ 🛺 ٣٤٥ س ع   │    │
│  └──────────────┘    │
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Today's Jobs        │
│  ┌──────────────┐    │
│  │ Job #1  12:30│    │
│  │ أحمد محمد    │    │
│  │ 2 items · 3km│    │
│  │ [ابدأ] ▶     │    │
│  ├──────────────┤    │
│  │ Job #2  13:15│    │
│  │ فاطمة علي    │    │
│  │ 5 items · 5km│    │
│  │ [في الانتظار]│    │
│  └──────────────┘    │
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Navigation          │
│  ┌──────────────┐    │
│  │   MAP        │    │
│  │  Route shown │    │
│  │  Turn-by-turn│    │
│  └──────────────┘    │
│  ETA: ١٤ دقيقة      │
│  ٢.٣ كم              │
│  [فتح الخرائط]       │
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Arrival & Proof     │
│  ┌──────────────┐    │
│  │ ✅ وصلت!      │    │
│  │              │    │
│  │ [📸 صورة]    │    │
│  │ [✍️ توقيع]    │    │
│  │ [📊 باركود]  │    │
│  │              │    │
│  │ [تم التسليم]  │    │
│  └──────────────┘    │
└──────────────────────┘
```

### 19.2 Driver App Features

| Feature | Description | Priority |
|---------|-------------|----------|
| OTP Login | Phone + 4-digit code (same as customer) | P0 |
| Shift start/end | Go online/offline | P0 |
| Job list | Today's assigned deliveries | P0 |
| Navigation | Deep link to Google Maps / Waze | P0 |
| Arrival confirmation | "I've arrived" button | P0 |
| Delivery photo | Camera capture of delivered items | P0 |
| Customer call | One-tap call button | P0 |
| Job details | Order items, address, notes | P0 |
| Multi-stop | Sequential delivery list | P1 |
| Barcode scan | Scan order barcode for B2B | P1 |
| Customer signature | Signature pad on screen | P1 |
| Offline mode | Queue GPS + actions locally | P1 |
| Earnings view | Today's earnings, delivery count | P2 |
| Route optimization | Suggested stop sequence | P2 |
| SOS button | Emergency alert | P0 |

### 19.3 Offline Mode Behavior

| Scenario | Online Behavior | Offline Behavior |
|----------|----------------|------------------|
| GPS ping | Send every 2s | Queue locally, batch on reconnect |
| Job acceptance | Immediate API call | Queue acceptance, sync later |
| Delivery photo | Upload immediately | Store locally, upload on reconnect |
| Status update | Real-time | Queue and replay with timestamps |
| Navigation | Live map | Cached route (pre-loaded) |
| New job notification | Push notification | Queue, show on reconnect |

### 19.4 Driver App Technology

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Framework | Progressive Web App (PWA) | Same codebase as customer app, works offline |
| Maps | Google Maps JS SDK | Best Egypt coverage, Arabic labels |
| Navigation | Deep links to native maps | Drivers prefer Google Maps/Waze |
| Camera | HTML5 MediaDevices API | Photo capture for proof |
| Storage | IndexedDB | Offline GPS queue, photo cache |
| Push | Firebase Cloud Messaging | Job notifications |
| GPS | Geolocation API + Background Fetch | Position tracking |

---

## 20. Database Design

### 20.1 Entity Relationship Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  warehouses  │────▶│ delivery_    │────▶│ drivers      │
│              │ 1:N │ zones        │ 1:N │              │
└──────┬───────┘     └──────────────┘     └──────┬───────┘
       │                                        │
       │ 1:N                                    │ 1:N
       ▼                                        ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  warehouse_  │     │  delivery_   │     │ driver_      │
│  regions     │     │  assignments │     │ locations    │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────┤──────┐
                     │      │      │
                     ▼      ▼      ▼
              ┌──────────┐ ┌────────────┐ ┌──────────────┐
              │ delivery_│ │ delivery_  │ │ route_       │
              │ tracking │ │ events     │ │ history      │
              └──────────┘ └────────────┘ └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  fleet       │────▶│  vehicles    │     │ customer_    │
│              │ 1:N │              │     │ locations    │
└──────────────┘     └──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  geofences   │     │ location_    │     │ tracking_    │
│              │     │  logs        │     │ sessions     │
└──────────────┘     └──────────────┘     └──────────────┘
```

### 20.2 Table Definitions (ggh schema)

All tables live in the `ggh` PostgreSQL schema, separate from Medusa's `public` schema.

#### `ggh.warehouses`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `erp_warehouse_id` | VARCHAR(50) | UQ, NOT NULL | ERPNext warehouse code |
| `name_en` | VARCHAR(200) | NOT NULL | English name |
| `name_ar` | VARCHAR(200) | NOT NULL | Arabic name |
| `latitude` | DECIMAL(10,7) | NOT NULL | GPS latitude |
| `longitude` | DECIMAL(10,7) | NOT NULL | GPS longitude |
| `address_en` | TEXT | | English address |
| `address_ar` | TEXT | | Arabic address |
| `coverage_radius_km` | DECIMAL(6,2) | DEFAULT 10.00 | Default coverage radius |
| `coverage_polygon` | JSONB | | GeoJSON custom coverage area |
| `region` | VARCHAR(100) | | Administrative region |
| `is_active` | BOOLEAN | DEFAULT true | Operational status |
| `operating_hours` | JSONB | | Daily operating schedule |
| `capacity_daily_orders` | INTEGER | DEFAULT 200 | Maximum daily orders |
| `temperature_controlled` | BOOLEAN | DEFAULT false | Has cold storage |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `deleted_at` | TIMESTAMPTZ | | Soft delete |

**Indexes**: `ix_warehouses_region`, `ix_warehouses_active`, GiST index on `coverage_polygon`

#### `ggh.delivery_zones`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `warehouse_id` | UUID | FK → warehouses, NOT NULL | Owning warehouse |
| `name_en` | VARCHAR(200) | NOT NULL | English zone name |
| `name_ar` | VARCHAR(200) | NOT NULL | Arabic zone name |
| `boundary` | JSONB | NOT NULL | GeoJSON polygon |
| `priority` | INTEGER | DEFAULT 5 | Assignment priority (1=highest) |
| `delivery_fee_amount` | BIGINT | DEFAULT 0 | Fee in piastres |
| `min_order_amount` | BIGINT | DEFAULT 0 | Minimum order in piastres |
| `estimated_delivery_min` | INTEGER | | Estimated minutes |
| `is_active` | BOOLEAN | DEFAULT true | |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes**: GiST index on `boundary`, `ix_delivery_zones_warehouse`, `ix_delivery_zones_active`

#### `ggh.drivers`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `erp_employee_id` | VARCHAR(50) | UQ | ERPNext Employee ID |
| `name_en` | VARCHAR(200) | NOT NULL | English name |
| `name_ar` | VARCHAR(200) | NOT NULL | Arabic name |
| `phone` | VARCHAR(20) | NOT NULL, UQ | Egyptian mobile |
| `national_id_encrypted` | TEXT | | Encrypted national ID |
| `license_number` | VARCHAR(50) | | Driving license |
| `license_expiry` | DATE | | License expiry |
| `vehicle_id` | UUID | FK → vehicles | Assigned vehicle |
| `warehouse_id` | UUID | FK → warehouses | Home warehouse |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'offline' | offline/online/busy/break/emergency |
| `rating` | DECIMAL(3,2) | DEFAULT 5.00 | Customer rating |
| `total_deliveries` | INTEGER | DEFAULT 0 | Lifetime count |
| `on_time_rate` | DECIMAL(5,2) | DEFAULT 100.00 | On-time percentage |
| `avatar_url` | TEXT | | Profile photo URL |
| `max_active_orders` | INTEGER | DEFAULT 3 | Simultaneous orders |
| `is_active` | BOOLEAN | DEFAULT true | Employed |
| `last_location_at` | TIMESTAMPTZ | | Last GPS ping |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `deleted_at` | TIMESTAMPTZ | | Soft delete |

**Indexes**: `ix_drivers_warehouse`, `ix_drivers_status`, `ix_drivers_phone`, `ix_drivers_active`

#### `ggh.driver_locations`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PK (auto) | Auto-increment |
| `driver_id` | UUID | FK → drivers, NOT NULL | Driver reference |
| `order_id` | UUID | | Current order (if any) |
| `latitude` | DECIMAL(10,7) | NOT NULL | GPS latitude |
| `longitude` | DECIMAL(10,7) | NOT NULL | GPS longitude |
| `accuracy` | INTEGER | | Accuracy in meters |
| `heading` | DECIMAL(5,1) | | Direction 0–360 |
| `speed` | DECIMAL(5,1) | | Speed in km/h |
| `battery_level` | INTEGER | | Battery % |
| `network_type` | VARCHAR(10) | | 2G/3G/4G/5G/WiFi |
| `recorded_at` | TIMESTAMPTZ | NOT NULL | Client-side timestamp |
| `server_at` | TIMESTAMPTZ | DEFAULT NOW() | Server receive time |

**Indexes**: `ix_driver_locations_driver_time` (driver_id, recorded_at DESC), PostGIS geometry index

**Partitioning**: Range partition by month on `recorded_at` for efficient queries and archival

#### `ggh.vehicles`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `erp_vehicle_id` | VARCHAR(50) | UQ | ERPNext Vehicle ID |
| `plate_number` | VARCHAR(20) | NOT NULL, UQ | Egyptian plate |
| `vehicle_type` | VARCHAR(20) | NOT NULL | motorcycle/tricycle/van/truck |
| `make` | VARCHAR(100) | | Manufacturer |
| `model` | VARCHAR(100) | | Model name |
| `year` | INTEGER | | Model year |
| `capacity_weight_kg` | DECIMAL(8,2) | | Max cargo weight |
| `capacity_volume_m3` | DECIMAL(8,2) | | Max cargo volume |
| `fuel_type` | VARCHAR(20) | | petrol/diesel/electric/cng |
| `current_fuel_pct` | DECIMAL(5,2) | | Current fuel level |
| `mileage_km` | INTEGER | DEFAULT 0 | Odometer |
| `insurance_expiry` | DATE | | Insurance date |
| `inspection_expiry` | DATE | | Inspection date |
| `warehouse_id` | UUID | FK → warehouses | Home warehouse |
| `status` | VARCHAR(20) | DEFAULT 'available' | available/in_use/maintenance/retired |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes**: `ix_vehicles_warehouse`, `ix_vehicles_status`, `ix_vehicles_plate`

#### `ggh.delivery_assignments`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `order_id` | UUID | NOT NULL, UQ | Medusa order ID |
| `driver_id` | UUID | FK → drivers | Assigned driver |
| `warehouse_id` | UUID | FK → warehouses, NOT NULL | Fulfilling warehouse |
| `vehicle_id` | UUID | FK → vehicles | Assigned vehicle |
| `status` | VARCHAR(30) | NOT NULL | placed/assigned/picking_up/on_the_way/nearby/arrived/delivering/delivered/failed |
| `priority` | INTEGER | DEFAULT 3 | P0–P4 priority |
| `route_polyline` | TEXT | | Encoded route |
| `estimated_distance_m` | INTEGER | | Route distance in meters |
| `estimated_duration_s` | INTEGER | | Route time in seconds |
| `actual_distance_m` | INTEGER | | Actual distance traveled |
| `actual_duration_s` | INTEGER | | Actual time taken |
| `assigned_at` | TIMESTAMPTZ | | When driver was assigned |
| `picked_up_at` | TIMESTAMPTZ | | When driver left warehouse |
| `delivered_at` | TIMESTAMPTZ | | When order was delivered |
| `failed_at` | TIMESTAMPTZ | | When delivery failed |
| `failure_reason` | VARCHAR(200) | | Why it failed |
| `proof_photo_url` | TEXT | | Delivery proof photo |
| `proof_signature_url` | TEXT | | Customer signature |
| `proof_otp_verified` | BOOLEAN | DEFAULT false | OTP verified |
| `stop_sequence` | INTEGER | | Order in multi-stop route |
| `delivery_notes` | TEXT | | Driver notes |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes**: `ix_delivery_assignments_order` (UQ), `ix_delivery_assignments_driver`, `ix_delivery_assignments_warehouse`, `ix_delivery_assignments_status`, `ix_delivery_assignments_created`

#### `ggh.delivery_events`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PK (auto) | Auto-increment |
| `assignment_id` | UUID | FK → delivery_assignments, NOT NULL | Parent assignment |
| `status` | VARCHAR(30) | NOT NULL | Status at this event |
| `latitude` | DECIMAL(10,7) | | GPS latitude at event |
| `longitude` | DECIMAL(10,7) | | GPS longitude at event |
| `metadata` | JSONB | | Extra event data |
| `occurred_at` | TIMESTAMPTZ | NOT NULL | When it happened |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes**: `ix_delivery_events_assignment` (assignment_id, occurred_at)

#### `ggh.customer_locations`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `customer_id` | UUID | NOT NULL | Medusa customer ID |
| `label` | VARCHAR(20) | NOT NULL | home/work/other |
| `label_custom` | VARCHAR(100) | | Custom label |
| `address_en` | TEXT | | English address |
| `address_ar` | TEXT | NOT NULL | Arabic address |
| `latitude` | DECIMAL(10,7) | NOT NULL | GPS latitude |
| `longitude` | DECIMAL(10,7) | NOT NULL | GPS longitude |
| `accuracy_meters` | INTEGER | | GPS accuracy |
| `building_number` | VARCHAR(50) | | Building |
| `floor_number` | VARCHAR(20) | | Floor |
| `apartment_number` | VARCHAR(20) | | Apartment |
| `landmark_en` | VARCHAR(200) | | Landmark (English) |
| `landmark_ar` | VARCHAR(200) | | Landmark (Arabic) |
| `delivery_notes` | TEXT | | Delivery instructions |
| `zone_id` | UUID | FK → delivery_zones | Auto-assigned zone |
| `warehouse_id` | UUID | FK → warehouses | Nearest warehouse |
| `is_default` | BOOLEAN | DEFAULT false | Default address |
| `is_verified` | BOOLEAN | DEFAULT false | GPS confirmed |
| `last_used_at` | TIMESTAMPTZ | | Last order with this address |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `deleted_at` | TIMESTAMPTZ | | Soft delete |

**Indexes**: `ix_customer_locations_customer` (customer_id, is_default), GiST spatial index, `ix_customer_locations_zone`

#### `ggh.geofences`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `name_en` | VARCHAR(200) | NOT NULL | English name |
| `name_ar` | VARCHAR(200) | NOT NULL | Arabic name |
| `type` | VARCHAR(30) | NOT NULL | warehouse/customer/zone/restricted/speed |
| `boundary` | JSONB | NOT NULL | GeoJSON polygon or circle |
| `reference_id` | UUID | | FK to related entity (warehouse, zone, etc.) |
| `alert_on_enter` | BOOLEAN | DEFAULT false | Notify on entry |
| `alert_on_exit` | BOOLEAN | DEFAULT false | Notify on exit |
| `speed_limit_kmh` | INTEGER | | Speed limit (if speed zone) |
| `is_active` | BOOLEAN | DEFAULT true | |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes**: GiST index on `boundary`, `ix_geofences_type`, `ix_geofences_active`

#### `ggh.route_history`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `driver_id` | UUID | FK → drivers, NOT NULL | Driver |
| `assignment_id` | UUID | FK → delivery_assignments | Delivery assignment |
| `warehouse_id` | UUID | FK → warehouses | Start warehouse |
| `route_type` | VARCHAR(20) | NOT NULL | delivery/transfer/return |
| `polyline` | TEXT | | Encoded route polyline |
| `distance_m` | INTEGER | | Total distance in meters |
| `duration_s` | INTEGER | | Total time in seconds |
| `stops_count` | INTEGER | DEFAULT 1 | Number of stops |
| `fuel_consumed_l` | DECIMAL(8,2) | | Estimated fuel used |
| `started_at` | TIMESTAMPTZ | NOT NULL | |
| `completed_at` | TIMESTAMPTZ | | |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes**: `ix_route_history_driver` (driver_id, started_at DESC), `ix_route_history_warehouse`

#### `ggh.tracking_sessions`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `order_id` | UUID | NOT NULL, UQ | Medusa order ID |
| `driver_id` | UUID | FK → drivers, NOT NULL | Driver |
| `status` | VARCHAR(20) | NOT NULL | active/completed/expired |
| `started_at` | TIMESTAMPTZ | NOT NULL | Session start |
| `ended_at` | TIMESTAMPTZ | | Session end |
| `last_eta_min` | INTEGER | | Last computed ETA |
| `last_eta_at` | TIMESTAMPTZ | | When ETA was last updated |
| `redis_key` | VARCHAR(100) | | Redis sorted set key |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes**: `ix_tracking_sessions_order` (UQ), `ix_tracking_sessions_driver`, `ix_tracking_sessions_status`

#### `ggh.location_logs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PK (auto) | Auto-increment |
| `entity_type` | VARCHAR(20) | NOT NULL | driver/customer/warehouse/vehicle |
| `entity_id` | UUID | NOT NULL | Reference ID |
| `action` | VARCHAR(50) | NOT NULL | enter_geofence/exit_geofence/assign/deliver/etc |
| `latitude` | DECIMAL(10,7) | | GPS latitude |
| `longitude` | DECIMAL(10,7) | | GPS longitude |
| `metadata` | JSONB | | Extra data |
| `occurred_at` | TIMESTAMPTZ | NOT NULL | |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes**: `ix_location_logs_entity` (entity_type, entity_id, occurred_at DESC)

**Partitioning**: Range partition by month on `occurred_at`

### 20.3 Spatial Indexes (PostGIS)

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Warehouse coverage polygon spatial index
CREATE INDEX ix_warehouses_coverage ON ggh.warehouses USING GIST (coverage_polygon::geometry);

-- Delivery zone boundary spatial index
CREATE INDEX ix_delivery_zones_boundary ON ggh.delivery_zones USING GIST (boundary::geometry);

-- Geofence boundary spatial index
CREATE INDEX ix_geofences_boundary ON ggh.geofences USING GIST (boundary::geometry);

-- Driver location spatial index (for "nearest driver" queries)
CREATE INDEX ix_driver_locations_point ON ggh.driver_locations USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);
```

### 20.4 Redis Data Structures

| Key Pattern | Type | TTL | Purpose |
|-------------|------|-----|---------|
| `track:{order_id}` | Sorted Set | 24h | GPS points for live tracking |
| `driver:status:{driver_id}` | Hash | None | Current driver status |
| `driver:location:{driver_id}` | Hash | 5min | Latest GPS position |
| `eta:{order_id}` | String | 1min | Current ETA in minutes |
| `geofence:events:{driver_id}` | List | 1h | Recent geofence events |
| `route:{order_id}` | String | 24h | Cached route polyline |

---

## 21. Security

### 21.1 Location Privacy Principles

| Principle | Implementation |
|-----------|---------------|
| **Purpose limitation** | GPS data used only for delivery tracking, not surveillance |
| **Data minimization** | Only collect GPS while driver is on shift |
| **Retention limits** | GPS history auto-deleted after 90 days (configurable) |
| **Access control** | Only ops managers see all driver positions; customers see only their assigned driver |
| **Anonymization** | Analytics use aggregated, anonymized location data |
| **Consent** | Drivers consent to GPS tracking as condition of employment |
| **Right to deletion** | Customers can delete saved locations; drivers can request GPS history deletion post-employment |

### 21.2 Authentication & Authorization

| Role | Location Access | Scope |
|------|----------------|-------|
| **Customer** | Own assigned driver only | During active order only |
| **Driver** | Own location + customer delivery address | Assigned orders only |
| **Warehouse Manager** | Drivers in own warehouse | Real-time + history |
| **Operations Manager** | All drivers + all warehouses | Real-time + history + analytics |
| **Admin** | Full access | All data |

### 21.3 Encryption

| Data | At Rest | In Transit |
|------|---------|------------|
| GPS coordinates | PostgreSQL TDE | TLS 1.3 |
| Driver national ID | AES-256 encrypted column | TLS 1.3 |
| Customer addresses | PostgreSQL standard | TLS 1.3 |
| GPS stream (Redis) | Redis TLS | TLS 1.3 |
| WebSocket/SSE | N/A | WSS (TLS) |
| API tokens | Encrypted in database | Bearer over HTTPS |

### 21.4 GPS Spoofing Prevention

| Check | Method |
|-------|--------|
| Impossible movement | Flag if GPS shows > 200 km/h ground speed |
| Jump detection | Flag if distance between pings implies > 300 km/h |
| Accuracy validation | Reject pings with accuracy > 200m |
| Building entry | GPS should degrade indoors (accuracy drops) |
| Consistency check | Compare driver route with known roads |
| Device integrity | Check if device is rooted/jailbroken (Phase 2) |

### 21.5 Audit Logging

Every location data access is logged:

| Event | Logged Data |
|-------|-------------|
| View driver location | Who viewed, which driver, timestamp |
| Export GPS history | Who exported, date range, drivers |
| Delete location data | Who deleted, what data, reason |
| Geofence alert | Driver, geofence, enter/exit, timestamp |
| Route accessed | Who accessed, order_id, timestamp |

---

## 22. Performance

### 22.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| GPS ping ingestion latency | < 50ms | Driver device → Redis store |
| Customer tracking update | < 2s | Driver GPS → Customer screen |
| Map tile load time | < 500ms | CDN → Browser |
| Nearest warehouse query | < 100ms | SQL with spatial index |
| Route calculation | < 3s | Maps API round-trip |
| Geofence detection | < 100ms | Point-in-polygon per ping |
| ETA recalculation | < 500ms | Per update cycle |
| Dashboard map render | < 2s | 50 drivers on screen |

### 22.2 Caching Strategy

| Cache | Data | TTL | Invalidation |
|-------|------|-----|-------------|
| Redis | Driver current location | 5 min | Each GPS ping |
| Redis | Route polyline | 24 hr | On reroute |
| Redis | ETA | 1 min | Each GPS ping |
| Redis | Geocoding results | 30 days | On address edit |
| CDN | Map tiles | 7 days | Provider update |
| Memory (BFF) | Warehouse list | 10 min | ERP sync |
| Memory (BFF) | Zone boundaries | 1 hr | Admin edit |
| Browser | Customer saved locations | Session | On CRUD |

### 22.3 Map Tile Optimization

| Technique | Description |
|-----------|-------------|
| Vector tiles | Use MVT format (smaller than raster) |
| Tile clustering | Cluster driver markers at low zoom levels |
| Viewport-based loading | Only fetch data within visible map bounds |
| Debounced pan/zoom | Don't request new data on every pixel of movement |
| Clustering | Group nearby drivers into count bubbles at zoom < 14 |

### 22.4 GPS Throttling

| Component | Throttle Rate | Rationale |
|-----------|--------------|-----------|
| Driver → Server | 1 ping per 2s minimum | Bandwidth conservation |
| Server → Customer | 1 update per 1s maximum | Smooth but not wasteful |
| Server → Redis | 1 write per 2s per driver | Storage optimization |
| Server → Database | 1 batch write per 30s | Reduce DB load |
| Geofence checks | Per ping (no throttle) | Must be real-time |

### 22.5 WebSocket Scaling

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Driver App  │────▶│  Location    │────▶│    Redis     │
│  (Socket.io) │     │  Service     │     │   Pub/Sub    │
└──────────────┘     │  (Port 3004) │     └──────┬───────┘
                     └──────────────┘            │
                            │                    │
                     ┌──────┴──────┐             │
                     │             │             │
                ┌────▼────┐  ┌────▼────┐        │
                │  BFF    │  │  BFF    │        │
                │ Inst. 1 │  │ Inst. 2 │◀───────┘
                └────┬────┘  └────┬────┘  Subscribe to
                     │             │        gps:{driver_id}
                ┌────▼────┐  ┌────▼────┐
                │Customer │  │Customer │
                │  SSE 1  │  │  SSE 2  │
                └─────────┘  └─────────┘
```

| Scaling Dimension | Strategy |
|------------------|----------|
| More drivers | Horizontal Location Service instances behind load balancer |
| More customers tracking | Horizontal BFF instances, Redis Pub/Sub fan-out |
| More warehouses | Independent tracking sessions, no cross-WH contention |
| More GPS history | Partitioned PostgreSQL tables, time-based archival |

### 22.6 Database Indexing Strategy

| Query | Index | Type |
|-------|-------|------|
| Find nearest warehouse to point | `ix_warehouses_coverage` | GiST (PostGIS) |
| Find zone containing point | `ix_delivery_zones_boundary` | GiST (PostGIS) |
| Find nearest available driver | `ix_driver_locations_point` | GiST (PostGIS) |
| Driver's recent locations | `ix_driver_locations_driver_time` | B-tree composite |
| Orders by status | `ix_delivery_assignments_status` | B-tree |
| Customer's saved addresses | `ix_customer_locations_customer` | B-tree composite |
| Geofence point-in-polygon | `ix_geofences_boundary` | GiST (PostGIS) |
| Route history by driver | `ix_route_history_driver` | B-tree composite |

---

## 23. Accessibility

### 23.1 Elder-Friendly Tracking (Om Ibrahim Persona)

Om Ibrahim is 62, uses a basic smartphone, reads Arabic only, and has never used a map application. The tracking experience must be **simpler than Uber** for her.

### 23.2 Accessibility Requirements

| Requirement | Standard | GGH Implementation |
|-------------|----------|-------------------|
| Touch targets | WCAG 2.2 SC 2.5.8 | Minimum 48px, recommended 56px for elderly |
| Text size | WCAG 2.1 SC 1.4.12 | Minimum 16px body, 24px status, 48px ETA |
| Color contrast | WCAG 2.1 SC 1.4.3 | Minimum 4.5:1 ratio for all text |
| Focus indicators | WCAG 2.4.7 | Visible focus ring on all interactive elements |
| Screen reader | WCAG 2.1 SC 4.1.2 | ARIA labels on all map elements |
| Language | WCAG 2.1 SC 3.1.1 | `lang="ar"` when Arabic, `lang="en"` when English |
| Orientation | WCAG 2.2 SC 1.3.4 | Works in both portrait and landscape |
| Time-based media | WCAG 2.1 SC 2.2.1 | ETA updates are non-critical, no auto-timeouts |

### 23.3 Tracking Page Accessibility Features

| Feature | Implementation |
|---------|---------------|
| Large status card | Status text 24px+, ETA 48px+, always visible |
| Audio status alerts | "السائق في الطريق" voice announcement (optional) |
| Vibration feedback | Phone vibration on status change |
| High-contrast driver card | White background, dark text, colored buttons |
| One-tap call | Green phone button, 56px touch target |
| Simple timeline | 4 states max shown (current + 3 upcoming) |
| No map required | Text-only mode available for low-data/slow devices |
| Auto-translate | If customer is Arabic, all driver info in Arabic |
| Landmark-based | Show "2 min from Al-Haram Mosque" instead of "300m" |

### 23.4 Map Accessibility

| Challenge | Solution |
|-----------|----------|
| Screen readers can't read maps | ARIA live region announces ETA + status changes |
| Low vision | High-contrast mode, large driver icon, bold route line |
| Color blindness | Never rely on color alone; use icons + text labels |
| Motor impairment | Large tap targets, no precise map interaction required |
| Cognitive load | Show only current status; hide complex details |
| Data saver mode | Text-only tracking (no map tiles), status updates via SMS |

---

## 24. Future Expansion

### 24.1 Roadmap

| Phase | Timeline | Features |
|-------|----------|----------|
| **Phase 1** | Q3 2025 | Customer locations, warehouse selection, basic tracking, driver status |
| **Phase 2** | Q4 2025 | Live map tracking, geofencing, route optimization, fleet dashboard |
| **Phase 3** | Q1 2026 | AI route optimization, predictive ETA, demand forecasting |
| **Phase 4** | Q2 2026 | Indoor warehouse positioning, IoT sensors, digital twins |
| **Phase 5** | Q3 2026+ | Drone delivery research, autonomous vehicle pilot |

### 24.2 AI & Machine Learning

| Feature | ML Model | Data Requirements | Expected Impact |
|---------|----------|-------------------|-----------------|
| Predictive ETA | Gradient Boosting (XGBoost) | 100K+ historical deliveries | ±5 min accuracy |
| Traffic prediction | LSTM neural network | 6+ months traffic data | 15% faster routes |
| Demand forecasting | Prophet / ARIMA | 12+ months order data | 20% better inventory placement |
| Driver assignment | Reinforcement Learning | 50K+ assignments | 25% more efficient |
| Route optimization | OR-Tools + ML refinement | 100K+ routes | 30% less distance |
| Delivery failure prediction | Random Forest | 10K+ failed deliveries | 40% fewer failures |

### 24.3 IoT Integration

| Sensor | Location | Data | Purpose |
|--------|----------|------|---------|
| Temperature sensor | Warehouse / Delivery vehicle | °C every 5 min | Cold chain compliance |
| Humidity sensor | Warehouse | % every 5 min | Storage condition monitoring |
| Door sensor | Warehouse / Vehicle | Open/close events | Security, inventory tracking |
| Weight sensor | Delivery vehicle | kg every stop | Cargo verification |
| RFID reader | Warehouse | Item scan events | Inventory tracking |
| GPS tracker (dedicated) | Vehicle | lat/lng every 1s | Fleet tracking (separate from phone) |

### 24.4 Indoor Warehouse Positioning

```
┌─────────────────────────────────────┐
│  Warehouse Interior Map             │
│                                     │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐   │
│  │ A1│ │ A2│ │ A3│ │ A4│ │ A5│   │
│  │Rice│ │Rice│ │Oil│ │Oil│ │Sugar│  │
│  └───┘ └───┘ └───┘ └───┘ └───┘   │
│         ● Worker position          │
│         (BLE beacon triangulation) │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐   │
│  │ B1│ │ B2│ │ B3│ │ B4│ │ B5│   │
│  │Pst│ │Pst│ │Tea│ │Tea│ │Cln│   │
│  └───┘ └───┘ └───┘ └───┘ └───┘   │
│                                     │
│  [●] Loading Dock                   │
└─────────────────────────────────────┘
```

| Technology | Accuracy | Cost | Maturity |
|-----------|----------|------|----------|
| BLE beacons | 1–3m | Low | High |
| Wi-Fi triangulation | 5–10m | Very low | Medium |
| UWB (Ultra-Wideband) | 10–30cm | High | Low |
| RFID | 1–5m | Medium | High |
| Computer vision | 0.5–2m | Medium | Low |

### 24.5 Digital Twin

A digital twin of each warehouse and the delivery fleet:

| Twin Component | Data Source | Use Case |
|---------------|------------|----------|
| Warehouse 3D model | Floor plans + IoT sensors | Optimize layout, simulate changes |
| Inventory positions | RFID + ERP | Find items faster, plan picking routes |
| Fleet simulation | GPS + ML models | Predict bottlenecks, test scenarios |
| Demand simulation | Order history + ML | Forecast warehouse needs, plan expansion |

### 24.6 Autonomous & Drone Delivery

| Technology | Maturity for Egypt | GGH Timeline |
|-----------|-------------------|-------------|
| Autonomous ground vehicles | Low (infrastructure, regulation) | Phase 5+ (2027+) |
| Delivery drones | Very Low (regulation, safety) | Research only |
| Sidewalk robots | Low (crowded streets) | Not applicable |
| Autonomous warehouse carts | Medium | Phase 4 (2026) |

---

## 25. Recommended Technology Stack

### 25.1 Core Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Maps SDK (Web)** | Google Maps JavaScript API | Best Egypt coverage, Arabic labels, traffic |
| **Maps SDK (Fallback)** | Mapbox GL JS | Excellent customization, free tier |
| **Routing Engine** | Google Directions API | Traffic-aware, Egypt road data |
| **Geocoding** | Google Geocoding API | Best Egyptian address resolution |
| **Reverse Geocoding** | Google Reverse Geocoding | Landmark detection, Arabic output |
| **GPS Ingestion** | Socket.io (Location Service) | Bidirectional, Redis adapter for scaling |
| **Customer Tracking** | Server-Sent Events (SSE) | Simple, HTTP-native, no WS complexity |
| **Real-time Pub/Sub** | Redis Pub/Sub | Low latency, already in stack |
| **Spatial Database** | PostgreSQL + PostGIS | Industry standard, GiST indexes |
| **GPS Storage** | Redis Sorted Sets (real-time) + PostgreSQL (history) | Hot/warm data separation |
| **Background Jobs** | BullMQ | Already in stack, reliable |
| **ERP Integration** | ERPNext REST API + Webhooks | Already in stack |
| **Caching** | Redis (geo + metadata) + CDN (map tiles) | Already in stack |
| **Monitoring** | Prometheus + Grafana | Fleet/GPS dashboards |
| **Analytics** | ClickHouse (Phase 2) | Fast OLAP for location analytics |

### 25.2 Location Service Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Bun | Latest |
| Framework | Hono or Elysia | Latest |
| WebSocket | Socket.io | 4.x |
| Redis client | ioredis | 5.x |
| PostgreSQL client | postgres (drizzle) | Latest |
| Maps client | @googlemaps/google-maps-services-js | 3.x |
| Validation | Zod | 4.x |
| Logging | pino | Latest |
| Health checks | Custom HTTP endpoint | — |

### 25.3 Mobile Driver App Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Framework | Progressive Web App (PWA) | Single codebase, offline capable |
| Maps | Google Maps JS SDK | Best Egypt data |
| Camera | HTML5 MediaDevices API | Photo proof |
| Storage | IndexedDB | Offline GPS queue |
| Push | Firebase Cloud Messaging | Job notifications |
| GPS | Geolocation API + Service Worker | Background tracking |
| Signature | Canvas API | Proof of delivery |

### 25.4 Third-Party Service Costs (Monthly Estimate)

| Service | Usage Tier | Est. Monthly Cost (USD) |
|---------|-----------|------------------------|
| Google Maps JS | 100K loads | $200 (free tier covers) |
| Google Directions | 50K requests | $200 |
| Google Geocoding | 20K requests | $80 |
| Mapbox (fallback) | 50K loads | $0 (free tier) |
| Redis Cloud | 500MB | $10 |
| PostgreSQL (managed) | db.t3.medium | $60 |
| Total (Phase 1) | | ~$550/month |

### 25.5 Development Phases vs. Technology

| Phase | Maps | Routing | Tracking | Analytics |
|-------|------|---------|----------|-----------|
| **Phase 1** | Mapbox (free) | Haversine only | Polling | PostgreSQL |
| **Phase 2** | Google Maps | Google Directions | Socket.io + SSE | PostgreSQL |
| **Phase 3** | Google Maps + Traffic | Google Directions + Traffic | Socket.io + SSE | ClickHouse |
| **Phase 4** | Google Maps + Indoor | Multi-provider | Socket.io + SSE | ClickHouse + ML |
| **Phase 5** | Multi-provider | ML-optimized | Edge computing | Real-time ML |

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **ETA** | Estimated Time of Arrival |
| **Geofence** | Virtual boundary defined by GPS coordinates |
| **GeoJSON** | Format for encoding geographic data structures |
| **GIS** | Geographic Information System |
| **GPS** | Global Positioning System |
| **Haversine** | Formula for great-circle distance between two points |
| **MVT** | Mapbox Vector Tiles — compact, styleable map tiles |
| **Piastres** | Egyptian currency subunit; EGP 1 = 100 piastres |
| **Polyline** | Encoded series of coordinates representing a route |
| **PostGIS** | PostgreSQL extension for geographic objects |
| **PWA** | Progressive Web App — web app with native-like features |
| **SSE** | Server-Sent Events — one-way real-time HTTP streaming |
| **TSP** | Traveling Salesman Problem — route optimization problem |
| **WebSocket** | Full-duplex communication protocol over TCP |

## Appendix B: Coordinate Reference System

| Property | Value |
|----------|-------|
| CRS | EPSG:4326 (WGS 84) |
| Latitude range | -90 to 90 (Egypt: ~22–32) |
| Longitude range | -180 to 180 (Egypt: ~25–37) |
| Cairo center | 30.0444°N, 31.2357°E |
| Storage precision | 7 decimal places (~1cm accuracy) |
| Display precision | 4 decimal places (~11m accuracy) |

## Appendix C: Egyptian Administrative Divisions

| Level | Arabic | English | Example |
|-------|--------|---------|---------|
| Governorate | محافظة | Governorate | القاهرة (Cairo) |
| Markaz | مركز | District/Center |الدقي (Dokki) |
| Hayy | حي | Neighborhood | الزمالك (Zamalek) |
| Shiyakha | شيخة | Sub-neighborhood | — |

## Appendix D: API Endpoint Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/locations` | POST | Save customer location |
| `/api/v1/locations` | GET | List customer's saved locations |
| `/api/v1/locations/:id` | PUT | Update saved location |
| `/api/v1/locations/:id` | DELETE | Delete saved location |
| `/api/v1/locations/geocode` | POST | Reverse geocode coordinates |
| `/api/v1/locations/validate` | POST | Validate address + check coverage |
| `/api/v1/tracking/:order_id` | GET | Get tracking session data |
| `/api/v1/tracking/:order_id/stream` | GET (SSE) | Live GPS stream for customer |
| `/api/v1/drivers/nearby` | GET | Find nearest available drivers (admin) |
| `/api/v1/warehouses/nearby` | GET | Find nearest warehouses to point |
| `/api/v1/warehouses/:id/coverage` | GET | Check if point is in warehouse coverage |
| `/api/v1/routes/calculate` | POST | Calculate route between points |
| `/api/v1/routes/optimize` | POST | Optimize multi-stop route |
| `/api/v1/geofences` | GET | List active geofences |
| `/api/v1/fleet/live` | GET | Live fleet positions (admin) |
| `/api/v1/analytics/delivery-heatmap` | GET | Delivery density data |

---

*End of Document — 09_Location_Logistics_Integration.md*
