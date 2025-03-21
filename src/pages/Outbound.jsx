import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import "../styles/Inventory.css";
import axios from "axios";

const Outbound = () => {
  const [outboundItems, setOutboundItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOutboundItems();
  }, []);

  const fetchOutboundItems = async () => {
    try {
      const response = await apiClient.get(`/api/outbound`); // ✅ 변경된 API 요청
      const data = response.data;
      console.log("📦 출고 요청 데이터:", data);

      // `content`가 있는지 확인 후 할당, 없으면 `data` 자체를 배열로 가정
      setOutboundItems(Array.isArray(data.content) ? data.content : data);
    } catch (error) {
      console.error("🚨 오류 발생:", error);
    }
  };

  const confirmOutbound = async (outboundId) => {
    try {
      const response = await apiClient.put(`/api/outbound/${outboundId}`, { confirmed: true }); // ✅ 변경된 API 요청

      if (!response.status === 200) throw new Error("출고 확정 실패");

      // ✅ UI 업데이트: 해당 항목을 리스트에서 제거
      setOutboundItems((prevItems) => prevItems.filter((item) => item.outboundId !== outboundId));
    } catch (error) {
      console.error("🚨 오류 발생:", error);
    }
  };

  return (
    <div className="inventory-container">
      <main className="inventory-content">
        <h1>🚚 출고 관리</h1>

        <div className="table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>선택</th>
                <th>출고 번호</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>수량</th>
                <th>가격</th>
                <th>공급업체</th>
                <th>위치</th>
                <th>등록일</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {outboundItems.length > 0 ? (
                outboundItems.map((item) => (
                  <tr key={item.outboundId}>
                    <td><input type="checkbox" /></td>
                    <td>{item.outboundId}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price} 원</td>
                    <td>{item.supplier}</td>
                    <td>{item.location}</td>
                    <td>{new Date(item.createdAt).toLocaleString("ko-KR")}</td>
                    <td>
                      <button className="action-btn confirm-btn" onClick={() => confirmOutbound(item.outboundId)}>
                        출고 확정
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-data">데이터 없음</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Outbound;
