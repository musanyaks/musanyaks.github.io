# Musa Rioba
**Data Engineer & Author** | nyakerabachi@gmail.com | [github.com/musanyaks](https://github.com/musanyaks) | [linkedin.com/in/musarioba](https://www.linkedin.com/in/musarioba/)

---

## Professional Summary

Data Engineer and published author with **6+ years of experience** building production data systems, automated pipelines, interactive dashboards, and visualization systems. Author of **"Production Data Science with R"** — a comprehensive guide covering end-to-end ML pipelines, ETL orchestration, real-time fraud detection, and A/B testing frameworks. Published three open-source R packages (`ugcensus`, `sacensus`, `kenyacensus`) and built multiple live dashboards including a clinical trial monitoring system and a sales analytics platform. Background in **Actuarial Science** with strong foundations in statistical modeling and risk analysis. **4 years as a Technical Trainer** teaching data analysis, R, and Python. Proficient in **R (Expert)**, **Python**, and **SQL**, with hands-on experience in **Apache Airflow, Apache Spark, dbt, Snowflake, Docker, and CI/CD**.

---

## Technical Skills

| Category | Skills |
|----------|--------|
| **Languages** | R (Expert), Python, SQL, Bash |
| **Data Engineering** | ETL/ELT pipelines, targets orchestration, Data cleaning & standardization, Web scraping, API integration (plumber), Data modeling |
| **Machine Learning** | tidymodels, XGBoost, Prophet, K-Means, RFM, Markov chains, Isolation forests |
| **Dashboards & Visualization** | R Shiny, shinydashboard, ggplot2, Plotly, DT, Matplotlib |
| **Databases & Cloud** | **Snowflake**, **PostgreSQL**, **Redis**, BigQuery (bigrquery), SQLite, dbplyr, AWS (learning) |
| **Package Development** | R package dev (devtools, roxygen2), Git/GitHub, Documentation, MIT Licensing, CC0 |
| **Deployment** | **Docker Compose**, **GitHub Actions**, Shinyapps.io, plumber APIs, bookdown, pre-commit |
| **Experimentation** | A/B testing, Sequential testing, Bayesian methods, Statistical modeling |

---

## Published Work

### "Production Data Science with R" — Author
*[fantastic-alfajores-5f5b96.netlify.app](https://fantastic-alfajores-5f5b96.netlify.app/) | Built with bookdown*

A hands-on guide for data scientists transitioning from exploratory analysis to production systems. Covers 8 production-grade chapters with real-world architecture, implementation, evaluation, and deployment.

**Chapters & Systems Built:**
- **End-to-end ML Pipelines** — `tidymodels` + `xgboost` with preprocessing, tuning, and deployment
- **Interactive Dashboards** — `shiny` + `plotly` production apps with reactive data flows
- **Marketing Attribution** — Markov chain models for multi-touch attribution
- **Demand Forecasting** — Prophet + XGBoost ensembles for time-series prediction
- **Customer Segmentation** — RFM analysis + K-Means clustering for behavioral segmentation
- **Real-time Fraud Detection** — Redis-backed isolation forest systems for streaming anomaly detection
- **Automated ETL Pipelines** — `targets` orchestration with dependency graphs, caching, and parallel execution
- **A/B Testing Frameworks** — Sequential testing + Bayesian methods for robust experimentation

**Production Principles:** Reproducibility, Scalability, Observability, Safety

---

## Experience

### **Freelance Data Engineer & Analyst**
*Upwork & Independent | 2020 — Present (2+ years active)*

- Delivered **custom data analysis and visualization projects** for clients across healthcare, demographics, and research sectors
- **Built automated data pipelines** using R and Python to extract, clean, and structure datasets from APIs, web sources, and raw files
- **Developed interactive dashboards** for client reporting, enabling stakeholders to explore data without technical expertise
- **Created reusable data tools** and scripts that reduced manual processing time for recurring client workflows
- Managed end-to-end project delivery: requirements gathering, data processing, visualization, and client presentation

### **Technical Trainer — Data Analysis & Programming**
*2020 — 2024 (4 years)*

- **Trained 100+ students and professionals** in data analysis, R programming, Python, and data visualization
- **Developed curricula and training materials** covering data cleaning, statistical analysis, dashboard building, and reproducible research
- **Mentored junior analysts** on best practices in data structuring, pipeline design, and code documentation
- **Conducted hands-on workshops** on building Shiny dashboards, creating R packages, and automating data workflows

---

## Projects

### End-to-End Data Engineering Pipeline
*Python · Apache Airflow · Apache Spark · dbt · Snowflake · Docker | [Source Code](https://github.com/musanyaks/data_engineering_python_project)*

A production-grade ETL/ELT data platform that ingests raw sales, customer, and product data from multiple sources, transforms it using the medallion architecture, and delivers analytics-ready datasets for business reporting.

- **Architected 3 Airflow DAGs** using CeleryExecutor with task dependency graphs, XCom cross-task communication, and automatic retry policies with exponential backoff
- **Built dual-mode processing layer** — Pandas for <1GB datasets, PySpark for 1–50GB datasets with Adaptive Query Execution and memory tuning for 16GB RAM laptops
- **Implemented dbt medallion architecture** — staging views → intermediate tables → incremental marts (fct_sales, dim_customers, dim_products, fct_daily_revenue) with SCD Type 2 snapshots
- **Developed multi-source extractors** — CSV (local files), Snowflake (key-pair authentication), REST API (with retry logic and timeout handling)
- **Built data quality gates** — runtime validators, dbt schema tests (uniqueness, not-null, positive revenue), and structured JSON logging via structlog
- **Containerized full stack** with Docker Compose — Airflow + Spark + PostgreSQL + Redis with resource limits tuned for 16GB RAM
- **Set up CI/CD** — GitHub Actions workflow, pre-commit hooks (formatting, linting, type checking), pytest with unit/integration/Spark test matrix
- **Wrote production-grade Python** — abstract base classes, context managers, generic type hints, composable pipeline builders

### TrialView Pro — Phase II Clinical Trial Monitoring System
*R Shiny · SQLite · Docker · CI/CD | [Live Demo](https://musanyaks.shinyapps.io/clinical-trial-dashboard/) · [Source Code](https://github.com/musanyaks/clinical-trial-dashboard)*

A production-ready clinical trial monitoring system for Phase II diabetes studies using **CDISC SDTM** standard data.

- **Architected role-based access control (RBAC)** — 3 user roles with scoped data permissions and site-level isolation
- **Built SQLite-backed data layer** with full audit trail logging for regulatory compliance
- **Developed patient management modules** — enrollment tracking, longitudinal profiles, AE/SAE reporting, efficacy lab results
- **Implemented safety monitoring** — SOC drill-down tables, CSV export, glucose trajectory visualization
- **Deployed via Docker** with multi-stage Dockerfile and docker-compose
- **Set up GitHub Actions CI/CD** — automated linting, styling, data integrity tests, and Docker smoke tests
- **Used modular Shiny architecture** — separated UI/server logic into reusable R modules

### Sales Analytics Dashboard
*R Shiny · bslib · plotly · DT | [Live Demo](https://musanyaks.shinyapps.io/R-shiny-dashboard/) · [Source Code](https://github.com/musanyaks/R-shiny-dashboard)*

A production-ready business intelligence dashboard for sales analytics and executive reporting.

- **Built reactive filtering system** — Region, Product, and Time Period filters instantly update all KPIs and charts
- **Designed KPI cards with trend indicators** — Revenue, Users, Conversion Rate, AOV with month-over-month changes
- **Created interactive Plotly charts** — Revenue trends, regional donut chart, product bar chart with hover details
- **Implemented sortable data tables** — Recent transactions with styled status badges using DT
- **Added one-click CSV export** — Download filtered data directly from the dashboard
- **Developed responsive dark theme UI** — Modern professional design using bslib, works on all devices

### Kenya Insurance Hub
*R Shiny · bslib · plotly · DT | [Live Demo](https://musanyaks.shinyapps.io/kenya-insurance-hub-v2/) · [Source Code](https://github.com/musanyaks/kenya-insurance-hub)*

A comprehensive insurance marketplace platform for Kenya's insurance market with 4 premium calculators, company directory, and market analysis.

- **Built 4 premium calculators** — Motor, Health, Life, and Agriculture with real-time quote comparison across 28 licensed insurers
- **Created company directory** — Filterable directory of 28 insurers with financial ratings, contact details, branch networks, and product listings
- **Developed market analysis module** — Interactive bar, pie, and treemap charts for market share, ratings, and product distribution
- **Integrated NHIF benefits** — Full coverage details for 19 NHIF benefits with co-payment and waiting period information
- **Added regulatory compliance tracking** — IRA contacts, complaint procedures, agent verification, and unlicensed scheme warnings
- **Structured 8 datasets** — 28 companies, 69 products, 41 motor premiums, 21 health premiums, 27 life premiums, 12 agriculture products, 19 NHIF benefits
- **Designed for multiple user types** — Consumers shopping for insurance, researchers analyzing trends, policymakers tracking industry performance

### `ugcensus` — Uganda Census Data Toolkit
*R Package | [github.com/musanyaks/ugcensus](https://github.com/musanyaks/ugcensus)*

Production-ready R package for Uganda's national census data (1991, 2002, 2014, 2024).

- **Built end-to-end data pipelines** that fetch, clean, structure, and standardize raw census data
- **Implemented data cleaning utilities** for inconsistent formatting, missing values, geographic code normalization
- **Created visualization functions** for interactive maps, population pyramids, time-series analysis
- Covers **17 sub-regions** and **45.9M population** (2024 census)

### `sacensus` — South African Census Data Toolkit
*R Package | [github.com/musanyaks/sacensus](https://github.com/musanyaks/sacensus)*

Toolkit for South African census data (1996, 2001, 2011, 2022).

- **Architected multi-level data access** — national, provincial, municipal, ward-level
- **Structured demographic datasets** — population, housing, education, employment, migration
- **Built automated comparison functions** for 26 years of census data
- Covers **9 provinces** and **62M population** (2022 census)

### `kenyacensus` — Kenya Population and Housing Census Data Toolkit
*R Package | [github.com/musanyaks/kenyacensus](https://github.com/musanyaks/kenyacensus)*

Comprehensive toolkit for Kenya's census data (1948–2019) from KNBS.

- **Built 13 themed datasets** — demographics, education, ethnicity, disability, water, ICT, employment
- **Covers 8 historical census years** across 71 years of data
- **Mapped 47 counties** with full 2019 socio-economic and demographic profiles
- **Created visualization suite** for trends, pyramids, county comparisons, choropleth maps
- Published under **CC0 (Public Domain)** license

---

## Education

**Bachelor of Science in Actuarial Science**  
Karatina University

- Strong foundation in statistical modeling, probability theory, risk analysis, and financial mathematics
- Coursework in data analysis, econometrics, and computational methods

---

## Contact

- **Email:** nyakerabachi@gmail.com
- **Portfolio:** https://musanyaks.github.io/
- **Book:** https://fantastic-alfajores-5f5b96.netlify.app/
- **GitHub:** https://github.com/musanyaks
- **LinkedIn:** https://www.linkedin.com/in/musarioba/
