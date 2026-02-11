import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style.css";

import { getInventory } from "../api/inventory";
import { getJobOrders, updateJobOrder, deleteJobOrder } from "../api/jobOrders";
import { clearAuth } from "../utils/auth";
import { logout as logoutAPI } from "../api/auth";

function MechanicDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [jobOrders, setJobOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [salesDate, setSalesDate] = useState("");
  const [salesStartDate, setSalesStartDate] = useState("");
  const [salesEndDate, setSalesEndDate] = useState("");
  const [salesLogDate, setSalesLogDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [inventoryRes, jobOrdersRes] = await Promise.all([
        getInventory(),
        getJobOrders(),
      ]);

      if (inventoryRes.success) {
        setProducts(inventoryRes.data);
      }
      if (jobOrdersRes.success) {
        setJobOrders(jobOrdersRes.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await logoutAPI(token);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  const handleDeleteJobOrder = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this completed job order?")) return;

    try {
      const result = await deleteJobOrder(jobId);
      if (result.success) {
        await loadData();
      } else {
        alert(result.error || "Failed to delete job order");
      }
    } catch (error) {
      console.error("Error deleting job order:", error);
      alert("Failed to delete job order. Please try again.");
    }
  };

  const handleUpdatePaymentType = async (order, nextPaymentType) => {
    const orderData = {
      id: order.id,
      joNumber: order.joNumber || order.job_order_no,
      client: order.client || order.customer_name || "",
      address: order.address || "",
      vehicleModel: order.vehicleModel || order.model || "",
      contactNumber: order.contactNumber || order.contact_no || "",
      plate: order.plate || order.plate_no || "",
      customerType: order.customerType || order.type || "Private",
      assignedTo: order.assignedTo || order.assigned_to || "",
      dateIn: order.dateIn || order.date || "",
      dateRelease: order.dateRelease || order.date_release || null,
      status: order.status || "Pending",
      paymentType: nextPaymentType,
      services: order.services || [],
      parts: order.parts || [],
      subtotal: parseFloat(order.subtotal || 0),
      discount: parseFloat(order.discount || 0),
      total: parseFloat(order.total || order.total_amount || 0),
    };

    try {
      const result = await updateJobOrder(orderData);
      if (result.success) {
        await loadData();
      } else {
        alert(result.error || "Failed to update payment type");
      }
    } catch (error) {
      console.error("Error updating payment type:", error);
      alert("Failed to update payment type. Please try again.");
    }
  };

  const formatJobOrderNo = (num) => String(num).padStart(4, "0");
  const getOrderDate = (order) => order.dateIn || order.date || "";
  const toDateKey = (dateStr) => (dateStr ? dateStr.slice(0, 10) : "");

  const computeOrderTotals = (order) => {
    const servicesList = order.services || [];
    const partsList = order.parts || [];

    const totalLabor = servicesList.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
    const totalPartsPrice = partsList.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);

    let unitPriceTotal = 0;
    partsList.forEach((p) => {
      const qty = parseFloat(p.qty) || 0;
      const code = (p.description || "").split(" - ")[0]?.trim();
      const product = products.find((prod) => prod.code?.toLowerCase() === (code || "").toLowerCase());
      if (product) {
        const unitCost = parseFloat(product.price) || 0;
        unitPriceTotal += unitCost * qty;
      }
    });

    const discountValue = parseFloat(order.discount) || 0;
    const totalAmount = totalLabor + totalPartsPrice - discountValue;
    const profit = totalPartsPrice - unitPriceTotal;

    return { totalLabor, totalPartsPrice, unitPriceTotal, totalAmount, profit, discountValue };
  };

  const completedOrders = jobOrders.filter((o) => o.status === "Completed");
  const todayKey = new Date().toISOString().slice(0, 10);

  const getPaymentType = (order) => {
    const paymentType = (order.paymentType || order.payment_type || "Cash").trim();
    return paymentType === "Accounts Receivable" ? "Accounts Receivable" : "Cash";
  };

  const summarizeByPaymentType = (orders) => {
    return orders.reduce(
      (acc, order) => {
        const totals = computeOrderTotals(order);
        if (getPaymentType(order) === "Accounts Receivable") {
          acc.arSales += totals.totalAmount;
          acc.arProfit += totals.profit;
        } else {
          acc.cashSales += totals.totalAmount;
          acc.cashProfit += totals.profit;
        }
        return acc;
      },
      { arSales: 0, arProfit: 0, cashSales: 0, cashProfit: 0 }
    );
  };

  const dailySales = completedOrders.reduce((sum, o) => {
    if (toDateKey(getOrderDate(o)) !== todayKey) return sum;
    return sum + computeOrderTotals(o).totalAmount;
  }, 0);

  const dailyProfit = completedOrders.reduce((sum, o) => {
    if (toDateKey(getOrderDate(o)) !== todayKey) return sum;
    return sum + computeOrderTotals(o).profit;
  }, 0);

  const dailyOrders = completedOrders.filter((o) => toDateKey(getOrderDate(o)) === todayKey);
  const dailyByPaymentType = summarizeByPaymentType(dailyOrders);

  const salesByDate = salesDate
    ? completedOrders.filter((o) => toDateKey(getOrderDate(o)) === salesDate)
    : [];

  const salesByRange = salesStartDate && salesEndDate
    ? completedOrders.filter((o) => {
        const key = toDateKey(getOrderDate(o));
        return key >= salesStartDate && key <= salesEndDate;
      })
    : [];

  const totalSalesByDate = salesByDate.reduce((sum, o) => sum + computeOrderTotals(o).totalAmount, 0);
  const totalProfitByDate = salesByDate.reduce((sum, o) => sum + computeOrderTotals(o).profit, 0);

  const totalSalesByRange = salesByRange.reduce((sum, o) => sum + computeOrderTotals(o).totalAmount, 0);
  const totalProfitByRange = salesByRange.reduce((sum, o) => sum + computeOrderTotals(o).profit, 0);
  const dateByPaymentType = summarizeByPaymentType(salesByDate);
  const rangeByPaymentType = summarizeByPaymentType(salesByRange);

  const filteredSalesOrders = salesLogDate
    ? completedOrders.filter((o) => toDateKey(getOrderDate(o)) === salesLogDate)
    : completedOrders;

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="content">
          <div className="left">
            <img src={process.env.PUBLIC_URL + "/HeaderLogo.png"} className="admin-logo" alt="Autronicas logo" />
          </div>
          <nav className="admin-nav">
            <button className="active">Sales</button>
            <button className="logout" onClick={handleLogout}>Logout</button>
          </nav>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="sales-section">
          <h2>Sales Management</h2>
          <div className="sales-cards">
            <div className="sales-card">
              <h4>Daily Summary Report</h4>
              <p>Total Sales: ₱{dailySales.toFixed(2)}</p>
              <p>Total Profit: ₱{dailyProfit.toFixed(2)}</p>
            </div>
            <div className="sales-card">
              <h4>View Sales by Date</h4>
              <input type="date" value={salesDate} onChange={(e) => setSalesDate(e.target.value)} />
              <p>Showing sales for: {salesDate || "-"}</p>
              <p>Total Sales: ₱{totalSalesByDate.toFixed(2)}</p>
              <p>Total Profit: ₱{totalProfitByDate.toFixed(2)}</p>
            </div>
            <div className="sales-card">
              <h4>Sales by Date Range</h4>
              <div className="sales-range">
                <label>Start:</label>
                <input type="date" value={salesStartDate} onChange={(e) => setSalesStartDate(e.target.value)} />
                <label>End:</label>
                <input type="date" value={salesEndDate} onChange={(e) => setSalesEndDate(e.target.value)} />
              </div>
              <p>Total: ₱{totalSalesByRange.toFixed(2)}</p>
              <p>Total Profit: ₱{totalProfitByRange.toFixed(2)}</p>
            </div>
            <div className="sales-card">
              <h4>Daily AR / Cash</h4>
              <p>AR Sales: PHP {dailyByPaymentType.arSales.toFixed(2)}</p>
              <p>AR Profit: PHP {dailyByPaymentType.arProfit.toFixed(2)}</p>
              <p>Cash Sales: PHP {dailyByPaymentType.cashSales.toFixed(2)}</p>
              <p>Cash Profit: PHP {dailyByPaymentType.cashProfit.toFixed(2)}</p>
            </div>
            <div className="sales-card">
              <h4>AR / Cash by Date</h4>
              <input type="date" value={salesDate} onChange={(e) => setSalesDate(e.target.value)} />
              <p>Showing for: {salesDate || "-"}</p>
              <p>AR Sales: PHP {dateByPaymentType.arSales.toFixed(2)}</p>
              <p>AR Profit: PHP {dateByPaymentType.arProfit.toFixed(2)}</p>
              <p>Cash Sales: PHP {dateByPaymentType.cashSales.toFixed(2)}</p>
              <p>Cash Profit: PHP {dateByPaymentType.cashProfit.toFixed(2)}</p>
            </div>
            <div className="sales-card">
              <h4>AR / Cash by Date Range</h4>
              <div className="sales-range">
                <label>Start:</label>
                <input type="date" value={salesStartDate} onChange={(e) => setSalesStartDate(e.target.value)} />
                <label>End:</label>
                <input type="date" value={salesEndDate} onChange={(e) => setSalesEndDate(e.target.value)} />
              </div>
              <p>AR Sales: PHP {rangeByPaymentType.arSales.toFixed(2)}</p>
              <p>AR Profit: PHP {rangeByPaymentType.arProfit.toFixed(2)}</p>
              <p>Cash Sales: PHP {rangeByPaymentType.cashSales.toFixed(2)}</p>
              <p>Cash Profit: PHP {rangeByPaymentType.cashProfit.toFixed(2)}</p>
            </div>
          </div>
          

          <div className="sales-log-header">
            <h3>Sales Log</h3>
            <div className="sales-log-actions">
              <div className="sales-filter">
                <label>Date:</label>
                <input type="date" value={salesLogDate} onChange={(e) => setSalesLogDate(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="sales-table-wrapper">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Job Order No.</th>
                  <th>Vehicle / Plate No.</th>
                  <th>Total Service (₱)</th>
                  <th>Total Parts Price (₱)</th>
                  <th>Unit Price (₱)</th>
                  <th>Discount (₱)</th>
                  <th>Total Amount (₱)</th>
                  <th>Profit (₱)</th>
                  <th>Status</th>
                  <th>Payment Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalesOrders.length === 0 ? (
                  <tr><td colSpan="12" className="empty-message">No sales records yet.</td></tr>
                ) : (
                  filteredSalesOrders.map((o) => {
                    const totals = computeOrderTotals(o);
                    return (
                      <tr key={`sales-${o.id}`}>
                        <td>{toDateKey(getOrderDate(o)) || "-"}</td>
                        <td>{formatJobOrderNo(o.joNumber || o.job_order_no)}</td>
                        <td>{o.vehicleModel || o.model || "-"} / {o.plate || o.plate_no || "-"}</td>
                        <td>₱{totals.totalLabor.toFixed(2)}</td>
                        <td>₱{totals.totalPartsPrice.toFixed(2)}</td>
                        <td>₱{totals.unitPriceTotal.toFixed(2)}</td>
                        <td>₱{totals.discountValue.toFixed(2)}</td>
                        <td>₱{totals.totalAmount.toFixed(2)}</td>
                        <td>₱{totals.profit.toFixed(2)}</td>
                        <td>
                          <span className={o.status === "Pending" ? "status-tag yellow" : o.status === "In Progress" ? "status-tag blue" : "status-tag green"}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={o.paymentType || o.payment_type || "Cash"}
                            onChange={(e) => handleUpdatePaymentType(o, e.target.value)}
                            style={{ marginBottom: 0 }}
                          >
                            <option value="Accounts Receivable">Accounts Receivable</option>
                            <option value="Cash">Cash</option> 
                          </select>
                        </td>
                        <td>
                          <button className="delete-btn" onClick={() => handleDeleteJobOrder(o.id)}>Delete</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MechanicDashboard;


