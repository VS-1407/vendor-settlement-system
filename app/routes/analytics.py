from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Settlement
from app.auth import admin_required
from sqlalchemy import func, Date
from app.models import Settlement, Vendor
from sqlalchemy import extract, func
from app.models import Order


router = APIRouter()


@router.get("/analytics/overview")
def analytics_overview(
    current_user = Depends(admin_required),
    db: Session = Depends(get_db)
):

    # Total payout amount
    total_payout = (
        db.query(
            func.sum(Settlement.amount)
        )
        .scalar()
    ) or 0


    # Successful settlements
    success_count = (
        db.query(Settlement)
        .filter(
            Settlement.status == "Success"
        )
        .count()
    )


    # Failed settlements
    failed_count = (
        db.query(Settlement)
        .filter(
            Settlement.status == "Failed"
        )
        .count()
    )


    # Pending settlements
    pending_count = (
        db.query(Settlement)
        .filter(
            Settlement.status == "Pending"
        )
        .count()
    )


    return {
        "total_vendor_payout": total_payout,
        "successful_transactions": success_count,
        "failed_transactions": failed_count,
        "pending_transactions": pending_count
    }

@router.get("/analytics/daily-report")
def daily_report(
    current_user = Depends(admin_required),
    db: Session = Depends(get_db)
):

    report = (
        db.query(
            func.date(Settlement.created_at).label("date"),
            func.sum(Settlement.amount).label("total_payout"),
            func.count(Settlement.id).label("total_transactions")
        )
        .group_by(
            func.date(Settlement.created_at)
        )
        .all()
    )


    return [
        {
            "date": row.date,
            "total_payout": row.total_payout,
            "transactions": row.total_transactions
        }
        for row in report
    ]


@router.get("/analytics/vendor-performance")
def vendor_performance(
    current_user = Depends(admin_required),
    db: Session = Depends(get_db)
):

    data = (
        db.query(
            Vendor.id,
            Vendor.name,
            func.sum(Settlement.amount).label("total_earnings"),
            func.count(Settlement.id).label("total_settlements")
        )
        .join(
            Settlement,
            Vendor.id == Settlement.vendor_id
        )
        .group_by(
            Vendor.id,
            Vendor.name
        )
        .all()
    )


    return [
        {
            "vendor_id": row.id,
            "vendor_name": row.name,
            "total_earnings": row.total_earnings,
            "total_settlements": row.total_settlements
        }
        for row in data
    ]

@router.get("/analytics/commission-report")
def commission_report(
    current_user = Depends(admin_required),
    db: Session = Depends(get_db)
):

    total_payout = (
        db.query(
            func.sum(Settlement.amount)
        )
        .scalar()
    ) or 0


    total_sales = total_payout / 0.90

    commission = total_sales * 0.10


    return {
        "total_vendor_payout": round(total_payout, 2),
        "estimated_total_sales": round(total_sales, 2),
        "platform_commission": round(commission, 2),
        "commission_rate": "10%"
    }

@router.get("/analytics/revenue")
def monthly_revenue(
    db: Session = Depends(get_db)
):

    revenue = (
        db.query(
            extract("month", Order.created_at).label("month"),
            func.sum(Order.amount).label("revenue")
        )
        .group_by(
            extract("month", Order.created_at)
        )
        .order_by(
            extract("month", Order.created_at)
        )
        .all()
    )

    month_names = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    return [
        {
            "month": month_names[int(row.month)],
            "revenue": float(row.revenue),
        }
        for row in revenue
    ]

@router.get("/analytics/orders")
def monthly_orders(
    current_user=Depends(admin_required),
    db: Session = Depends(get_db)
):

    data = (
        db.query(
            extract("month", Order.created_at).label("month"),
            func.count(Order.id).label("orders")
        )
        .group_by(
            extract("month", Order.created_at)
        )
        .order_by(
            extract("month", Order.created_at)
        )
        .all()
    )

    months = [
        "",
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
    ]

    return [
        {
            "month": months[int(row.month)],
            "orders": row.orders
        }
        for row in data
    ]

@router.get("/analytics/settlement-status")
def settlement_status(
    current_user=Depends(admin_required),
    db: Session = Depends(get_db)
):

    statuses = [
        "Pending",
        "Success",
        "Failed",
        "Paid"
    ]

    return {
        status: (
            db.query(Settlement)
            .filter(Settlement.status == status)
            .count()
        )
        for status in statuses
    }

@router.get("/analytics/top-vendors")
def top_vendors(
    current_user=Depends(admin_required),
    db: Session = Depends(get_db)
):

    vendors = (
        db.query(
            Vendor.name,
            func.sum(Settlement.amount).label("revenue")
        )
        .join(
            Settlement,
            Vendor.id == Settlement.vendor_id
        )
        .group_by(Vendor.name)
        .order_by(
            func.sum(Settlement.amount).desc()
        )
        .limit(5)
        .all()
    )

    return [
        {
            "vendor": row.name,
            "revenue": float(row.revenue)
        }
        for row in vendors
    ]

