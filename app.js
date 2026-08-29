(() => {
  "use strict";

  const STORAGE_PREFIX = "tianli-demo-v01:";
  const STATUS_CLASSES = {
    "已交付": "success",
    "合格": "success",
    "执行中": "info",
    "待计划": "warning",
    "待检": "warning",
    "检验中": "info",
    "已延期": "danger",
    "不合格": "danger",
    "已归档": "",
  };

  const pages = {
    operations: {
      title: "生产经营计划",
      description: "围绕客户需求编制经营计划，跟踪计划量与交付进度。",
      kicker: "计划工作表",
      tableTitle: "经营计划明细",
      hint: "统一维护客户需求、计划量、交付日期和执行状态。",
      searchPlaceholder: "搜索产品名称或需求方",
      dateKey: "deliveryDate",
      statusKey: "status",
      categories: true,
      fields: [
        { key: "productName", label: "产品名称", required: true, placeholder: "例如：一水柠檬酸" },
        { key: "demandParty", label: "需求方", required: true, placeholder: "请输入客户或部门名称" },
        { key: "plannedQty", label: "计划量", type: "number", required: true, placeholder: "请输入计划数量", min: "0" },
        { key: "deliveryDate", label: "交付日期", type: "date", required: true },
        { key: "status", label: "交付状态", type: "select", required: true, options: ["待计划", "执行中", "已交付", "已延期"] },
        { key: "note", label: "备注", type: "textarea", full: true, placeholder: "可填写本次计划的补充说明" },
      ],
      columns: [
        { key: "productName", label: "产品名称" },
        { key: "demandParty", label: "需求方" },
        { key: "plannedQty", label: "计划量", format: (v) => v ? `${v} 吨` : "—" },
        { key: "deliveryDate", label: "交付日期", format: formatDate },
        { key: "status", label: "交付状态", status: true },
        { key: "details", label: "查看详情", action: "details" },
      ],
    },
    procurement: {
      title: "采购计划管理",
      description: "依据客户采购订单制定采购安排，保障库存底线与按期到货。",
      kicker: "常规采购 · 工作表",
      tableTitle: "常规采购计划",
      hint: "集中维护采购品类、到货安排、付款方式与负责人。",
      searchPlaceholder: "搜索品类、厂家或负责人",
      dateKey: "arrivalDeadline",
      statusKey: "status",
      fields: [
        { key: "categoryName", label: "品类名称", required: true, placeholder: "请输入采购品类" },
        { key: "spec", label: "规格", required: true, placeholder: "例如：25kg/袋" },
        { key: "quantity", label: "数量（吨）", type: "number", required: true, placeholder: "请输入数量（吨）", min: "0" },
        { key: "unitPrice", label: "单价（元/吨）", type: "number", required: true, placeholder: "请输入含税单价", min: "0", step: "0.01" },
        { key: "paymentMethod", label: "付款方式", type: "select", required: true, options: ["现款现货", "账期 30 天", "预付 30%", "分批结算"] },
        { key: "manufacturer", label: "生产厂家", required: true, placeholder: "请输入生产厂家" },
        { key: "arrivalDeadline", label: "要求到货期限", type: "date", required: true },
        { key: "owner", label: "负责人", required: true, placeholder: "请输入负责人" },
        { key: "status", label: "采购状态", type: "select", required: true, options: ["待计划", "执行中", "已交付", "已延期"] },
      ],
      columns: [
        { key: "categoryName", label: "品类名称" },
        { key: "spec", label: "规格" },
        { key: "quantity", label: "数量（吨）", format: (v) => v ? `${v} 吨` : "—" },
        { key: "unitPrice", label: "单价（元/吨）", format: formatCurrency },
        { key: "totalAmount", label: "合计金额（元）", format: formatCurrency },
        { key: "paymentMethod", label: "付款方式" },
        { key: "manufacturer", label: "生产厂家" },
        { key: "arrivalDeadline", label: "要求到货期限", format: formatDate },
        { key: "owner", label: "负责人" },
        { key: "status", label: "采购状态", status: true },
      ],
    },
    quality: {
      title: "产品质量管理",
      description: "集中管理产品检测资料与生产批次质量追溯信息。",
      kicker: "产品质量追溯 · 工作表",
      tableTitle: "产品质量追溯记录",
      hint: "按生产批次维护产品、原材料、检测结果与实物标签信息。",
      searchPlaceholder: "请输入产品生产批次",
      dateKey: "productionTime",
      statusKey: "inspectionResult",
      emptyTitle: "暂无质量追溯记录",
      emptyHint: "新增追溯记录后，相关生产与检测信息将在此统一管理",
      showActions: false,
      fields: [
        { key: "productionBatch", label: "产品生产批次", required: true, placeholder: "请输入产品生产批次" },
        { key: "machineShift", label: "机台班次", required: true, placeholder: "例如：2 号机 · 早班" },
        { key: "productName", label: "产品名称", required: true, placeholder: "请输入产品名称" },
        { key: "materialBatch", label: "原材料批次", required: true, placeholder: "请输入原材料批次" },
        { key: "productionTime", label: "产品生产时间", type: "datetime-local", required: true },
        { key: "inspectionResult", label: "检测结果", type: "select", required: true, options: ["待检", "检验中", "合格", "不合格"] },
        { key: "inspector", label: "检验员", required: true, placeholder: "请输入检验员姓名" },
        { key: "physicalLabel", label: "实物标签", type: "image", full: true },
      ],
      columns: [
        { key: "machineShift", label: "机台班次" },
        { key: "productName", label: "产品名称" },
        { key: "materialBatch", label: "原材料批次" },
        { key: "productionTime", label: "产品生产时间", format: formatDateTime },
        { key: "inspectionResult", label: "检测结果", status: true },
        { key: "inspector", label: "检验员" },
        { key: "physicalLabel", label: "实物标签", image: true },
      ],
    },
  };

  const state = {
    page: "operations",
    records: {},
    search: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    category: "柠檬酸",
    sortDirection: "none",
    editingId: null,
    imageData: "",
    confirmAction: null,
  };

  const el = Object.fromEntries(
    [
      "breadcrumbCurrent", "pageTitle", "pageDescription", "sectionKicker", "tableTitle", "tableHint",
      "procurementSwitcher", "qualitySwitcher", "workspaceCard", "categoryRow", "searchBox", "searchPrefix",
      "searchInput", "searchButton", "toolbarActions", "filterButton", "sortButton",
      "resetButton", "filterPanel", "statusFilter", "dateFrom", "dateTo", "clearFilters", "tableHead",
      "tableBody", "recordCount", "addRecord", "recordModal", "modalKicker", "modalTitle", "recordForm",
      "formFields",
      "confirmPopover", "confirmTitle", "confirmText", "cancelConfirm", "acceptConfirm", "toastRegion",
      "userMenu", "accountPopover", "mainNav",
    ].map((id) => [id, document.getElementById(id)])
  );

  function storageKey(page) {
    return `${STORAGE_PREFIX}${page === "quality" ? "quality-trace-v2" : page}`;
  }

  function loadRecords(page) {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey(page)) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveRecords(page) {
    localStorage.setItem(storageKey(page), JSON.stringify(state.records[page]));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatCurrency(value) {
    if (value === "" || value == null || Number.isNaN(Number(value))) return "—";
    return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 2 }).format(Number(value));
  }

  function formatDate(value) {
    if (!value) return "—";
    const [year, month, day] = value.split("-");
    return year && month && day ? `${year}.${month}.${day}` : escapeHtml(value);
  }

  function formatDateTime(value) {
    if (!value) return "—";
    const [date, time = ""] = value.split("T");
    return `${formatDate(date)}${time ? ` ${escapeHtml(time.slice(0, 5))}` : ""}`;
  }

  function nowId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function currentConfig() {
    return pages[state.page];
  }

  function setPage(page) {
    state.page = page;
    state.search = "";
    state.status = "";
    state.dateFrom = "";
    state.dateTo = "";
    state.sortDirection = "none";
    el.searchInput.value = "";
    el.dateFrom.value = "";
    el.dateTo.value = "";
    el.filterPanel.hidden = true;

    document.querySelectorAll(".nav-item[data-page]").forEach((item) => {
      item.classList.toggle("active", item.dataset.page === page);
    });

    const config = currentConfig();
    el.breadcrumbCurrent.textContent = config.title;
    el.pageTitle.textContent = config.title;
    el.pageDescription.textContent = config.description;
    el.sectionKicker.textContent = config.kicker;
    el.tableTitle.textContent = config.tableTitle;
    el.tableHint.textContent = config.hint;
    el.searchInput.placeholder = config.searchPlaceholder;
    el.categoryRow.hidden = !config.categories;
    el.procurementSwitcher.hidden = page !== "procurement";
    el.qualitySwitcher.hidden = page !== "quality";
    el.workspaceCard.hidden = page === "quality";
    el.searchPrefix.hidden = page !== "quality";
    el.searchBox.classList.toggle("batch-search", page === "quality");
    el.toolbarActions.hidden = page === "quality";
    el.searchButton.textContent = page === "quality" ? "查询" : "检索";
    el.sortButton.innerHTML = `<svg><use href="#i-sort"></use></svg>${config.dateKey ? "交付日期排序" : "默认排序"}`;
    el.sortButton.disabled = !config.dateKey;
    buildStatusOptions();
    renderTable();
  }

  function buildStatusOptions() {
    const statusField = currentConfig().fields.find((field) => field.key === currentConfig().statusKey);
    el.statusFilter.innerHTML = `<option value="">全部状态</option>${(statusField?.options || []).map((status) => `<option value="${escapeHtml(status)}">${escapeHtml(status)}</option>`).join("")}`;
    el.statusFilter.value = state.status;
  }

  function getVisibleRecords() {
    const config = currentConfig();
    let records = [...state.records[state.page]];
    const query = state.search.trim().toLowerCase();

    if (query) {
      records = state.page === "quality"
        ? records.filter((record) => String(record.productionBatch || "").toLowerCase().includes(query))
        : records.filter((record) => Object.values(record).some((value) => typeof value === "string" && value.toLowerCase().includes(query)));
    }
    if (state.status && config.statusKey) {
      records = records.filter((record) => record[config.statusKey] === state.status);
    }
    if (config.categories && state.category !== "全部") {
      records = records.filter((record) => (record.category || "柠檬酸") === state.category);
    }
    if (config.dateKey && state.dateFrom) {
      records = records.filter((record) => record[config.dateKey] && record[config.dateKey] >= state.dateFrom);
    }
    if (config.dateKey && state.dateTo) {
      records = records.filter((record) => record[config.dateKey] && record[config.dateKey] <= state.dateTo);
    }
    if (config.dateKey && state.sortDirection !== "none") {
      records.sort((a, b) => {
        const first = a[config.dateKey] || "9999-12-31";
        const second = b[config.dateKey] || "9999-12-31";
        return state.sortDirection === "asc" ? first.localeCompare(second) : second.localeCompare(first);
      });
    }
    return records;
  }

  function renderTable() {
    const config = currentConfig();
    const records = getVisibleRecords();
    const actionHeader = config.showActions === false ? "" : "<th>操作</th>";
    el.tableHead.innerHTML = `<tr>${config.columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}${actionHeader}</tr>`;

    if (!records.length) {
      const filtering = state.search || state.status || state.dateFrom || state.dateTo || (config.categories && state.category !== "柠檬酸");
      el.tableBody.innerHTML = `
        <tr class="empty-row"><td colspan="${config.columns.length + (config.showActions === false ? 0 : 1)}">
          <div class="empty-state">
            <svg><use href="#i-empty"></use></svg>
            <strong>${filtering ? "没有找到符合条件的记录" : (config.emptyTitle || "暂无计划数据")}</strong>
            <span>${filtering ? "请调整搜索或筛选条件后重试" : (config.emptyHint || "新增计划后，相关业务记录将在此统一管理")}</span>
            <button class="btn" type="button" data-empty-add><svg><use href="#i-plus"></use></svg>新增第一条记录</button>
          </div>
        </td></tr>`;
    } else {
      el.tableBody.innerHTML = records.map((record) => renderRow(record, config)).join("");
    }
    const total = state.records[state.page].length;
    el.recordCount.textContent = state.search || state.status || state.dateFrom || state.dateTo ? `显示 ${records.length} 条 · 共 ${total} 条记录` : `共 ${total} 条记录`;
  }

  function renderRow(record, config) {
    const cells = config.columns.map((column) => {
      const raw = record[column.key];
      if (column.status) {
        const statusClass = STATUS_CLASSES[raw] || "";
        return `<td><span class="status-pill ${statusClass}">${escapeHtml(raw || "未设置")}</span></td>`;
      }
      if (column.image) {
        return `<td>${raw ? `<img class="label-preview" src="${escapeHtml(raw)}" alt="实物标签" />` : `<span class="status-pill">未上传</span>`}</td>`;
      }
      if (column.action === "details") {
        return `<td><button class="row-action" type="button" data-row-action="details" data-id="${record.id}">查看详情</button></td>`;
      }
      if (column.action === "favorite") {
        return `<td><button class="row-action ${record.favorite ? "starred" : ""}" type="button" data-row-action="favorite" data-id="${record.id}" aria-label="${record.favorite ? "取消收藏" : "收藏"}"><svg><use href="#i-star"></use></svg></button></td>`;
      }
      const value = column.format ? column.format(raw) : escapeHtml(raw || "—");
      return `<td>${value}</td>`;
    }).join("");

    const actionCell = config.showActions === false ? "" : `<td><div class="action-cell"><button class="row-action" type="button" data-row-action="edit" data-id="${record.id}">编辑</button><button class="row-action more" type="button" data-row-action="more" data-id="${record.id}" aria-label="更多操作"><svg><use href="#i-more"></use></svg></button></div></td>`;
    return `<tr data-record-id="${record.id}">${cells}${actionCell}</tr>`;
  }

  function openRecordModal(record = null) {
    state.editingId = record?.id || null;
    state.imageData = record?.physicalLabel || "";
    el.modalKicker.textContent = currentConfig().title;
    el.modalTitle.textContent = record ? "编辑记录" : "新增记录";
    el.formFields.innerHTML = currentConfig().fields.map((field) => renderField(field, record)).join("");
    el.recordModal.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => el.formFields.querySelector("input, select, textarea")?.focus());
    bindUploadField();
  }

  function renderField(field, record) {
    const value = record?.[field.key] ?? "";
    const required = field.required ? "required" : "";
    const requiredLabel = field.required ? "<b>*</b>" : "";
    const full = field.full ? "full" : "";
    const attrs = [
      field.min != null ? `min="${field.min}"` : "",
      field.step != null ? `step="${field.step}"` : "",
      field.placeholder ? `placeholder="${escapeHtml(field.placeholder)}"` : "",
    ].join(" ");

    let control = "";
    if (field.type === "select") {
      control = `<select name="${field.key}" ${required}><option value="">请选择${escapeHtml(field.label)}</option>${field.options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>`;
    } else if (field.type === "textarea") {
      control = `<textarea name="${field.key}" rows="3" ${required} ${attrs}>${escapeHtml(value)}</textarea>`;
    } else if (field.type === "image") {
      control = `<label class="upload-field" id="uploadField">${value ? `<img class="upload-preview" src="${escapeHtml(value)}" alt="标签预览" />` : `<svg><use href="#i-upload"></use></svg><span>点击选择实物标签图片<br><small>支持 PNG、JPG、WebP 格式</small></span>`}<input name="${field.key}" type="file" accept="image/png,image/jpeg,image/webp" /></label>`;
    } else {
      control = `<input name="${field.key}" type="${field.type || "text"}" value="${escapeHtml(value)}" ${required} ${attrs} />`;
    }
    return `<label class="field ${full}"><span>${escapeHtml(field.label)}${requiredLabel}</span>${control}</label>`;
  }

  function bindUploadField() {
    const input = el.formFields.querySelector('input[type="file"]');
    if (!input) return;
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 3_500_000) {
        showToast("图片请控制在 3.5MB 以内", "info");
        input.value = "";
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        state.imageData = String(reader.result || "");
        const field = document.getElementById("uploadField");
        field.querySelector("svg, span, img")?.remove();
        field.insertAdjacentHTML("afterbegin", `<img class="upload-preview" src="${escapeHtml(state.imageData)}" alt="标签预览" /><span>已选择 ${escapeHtml(file.name)}<br><small>再次点击可更换图片</small></span>`);
      });
      reader.readAsDataURL(file);
    });
  }

  function closeRecordModal() {
    el.recordModal.hidden = true;
    state.editingId = null;
    state.imageData = "";
    document.body.style.overflow = "";
    el.recordForm.reset();
  }

  function submitRecord(event) {
    event.preventDefault();
    const formData = new FormData(el.recordForm);
    const record = {};
    currentConfig().fields.forEach((field) => {
      record[field.key] = field.type === "image" ? state.imageData : String(formData.get(field.key) || "").trim();
    });

    if (state.page === "procurement") {
      record.totalAmount = (Number(record.quantity || 0) * Number(record.unitPrice || 0)).toFixed(2);
    }
    if (state.page === "operations") {
      record.category = state.category === "全部" ? "柠檬酸" : state.category;
    }

    const records = state.records[state.page];
    if (state.editingId) {
      const index = records.findIndex((item) => item.id === state.editingId);
      if (index >= 0) records[index] = { ...records[index], ...record, updatedAt: new Date().toISOString() };
      showToast("记录已更新");
    } else {
      records.unshift({ id: nowId(), ...record, favorite: false, createdAt: new Date().toISOString() });
      showToast("记录已添加到工作表");
    }
    saveRecords(state.page);
    closeRecordModal();
    renderTable();
  }

  function openMoreMenu(button, recordId) {
    closeActionMenu();
    const rect = button.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.className = "action-menu";
    menu.id = "activeActionMenu";
    menu.style.left = `${Math.max(8, rect.right - 120)}px`;
    menu.style.top = `${Math.min(window.innerHeight - 100, rect.bottom + 5)}px`;
    menu.innerHTML = `<button type="button" data-menu-action="archive" data-id="${recordId}">归档记录</button><button class="danger" type="button" data-menu-action="delete" data-id="${recordId}">删除记录</button>`;
    document.body.appendChild(menu);
  }

  function closeActionMenu() {
    document.getElementById("activeActionMenu")?.remove();
  }

  function requestConfirmation(type, recordId) {
    closeActionMenu();
    const isDelete = type === "delete";
    el.confirmTitle.textContent = isDelete ? "确认删除这条记录？" : "确认归档这条记录？";
    el.confirmText.textContent = isDelete ? "删除后将无法恢复。" : "归档后记录仍将保留，可继续查看和编辑。";
    el.acceptConfirm.textContent = isDelete ? "确认删除" : "确认归档";
    state.confirmAction = { type, recordId };
    el.confirmPopover.hidden = false;
  }

  function acceptConfirmation() {
    const action = state.confirmAction;
    if (!action) return;
    const records = state.records[state.page];
    const index = records.findIndex((record) => record.id === action.recordId);
    if (index >= 0) {
      if (action.type === "delete") records.splice(index, 1);
      else {
        const statusKey = currentConfig().statusKey;
        if (statusKey) records[index][statusKey] = "已归档";
        records[index].archived = true;
      }
      saveRecords(state.page);
      renderTable();
      showToast(action.type === "delete" ? "记录已删除" : "记录已归档");
    }
    el.confirmPopover.hidden = true;
    state.confirmAction = null;
  }

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    el.toastRegion.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3200);
  }

  function runSearch() {
    state.search = el.searchInput.value;
    renderTable();
  }

  function resetCurrentPage() {
    if (!state.records[state.page].length) {
      state.search = "";
      state.status = "";
      state.dateFrom = "";
      state.dateTo = "";
      el.searchInput.value = "";
      el.statusFilter.value = "";
      el.dateFrom.value = "";
      el.dateTo.value = "";
      renderTable();
      showToast("当前页面已恢复初始状态");
      return;
    }
    el.confirmTitle.textContent = "确认重置当前页面数据？";
    el.confirmText.textContent = "当前工作表中的记录将全部清空，此操作无法撤销。";
    el.acceptConfirm.textContent = "确认重置";
    state.confirmAction = { type: "reset", recordId: null };
    el.confirmPopover.hidden = false;
  }

  function handleResetConfirmation() {
    state.records[state.page] = [];
    saveRecords(state.page);
    state.search = "";
    state.status = "";
    state.dateFrom = "";
    state.dateTo = "";
    el.searchInput.value = "";
    el.statusFilter.value = "";
    el.dateFrom.value = "";
    el.dateTo.value = "";
    renderTable();
    showToast("当前工作表已清空");
  }

  function bindEvents() {
    el.mainNav.addEventListener("click", (event) => {
      const item = event.target.closest(".nav-item");
      if (!item) return;
      if (item.dataset.page) setPage(item.dataset.page);
      else showToast(`${item.dataset.label}当前暂无待处理事项`, "info");
    });

    el.addRecord.addEventListener("click", () => openRecordModal());
    el.searchButton.addEventListener("click", runSearch);
    el.searchInput.addEventListener("keydown", (event) => { if (event.key === "Enter") runSearch(); });
    el.searchInput.addEventListener("input", () => { if (!el.searchInput.value) { state.search = ""; renderTable(); } });
    el.filterButton.addEventListener("click", () => { el.filterPanel.hidden = !el.filterPanel.hidden; });
    el.sortButton.addEventListener("click", () => {
      state.sortDirection = state.sortDirection === "none" ? "asc" : state.sortDirection === "asc" ? "desc" : "none";
      const labels = { none: "交付日期排序", asc: "日期从早到晚", desc: "日期从晚到早" };
      el.sortButton.innerHTML = `<svg><use href="#i-sort"></use></svg>${labels[state.sortDirection]}`;
      renderTable();
    });
    el.resetButton.addEventListener("click", resetCurrentPage);
    el.statusFilter.addEventListener("change", () => { state.status = el.statusFilter.value; renderTable(); });
    el.dateFrom.addEventListener("change", () => { state.dateFrom = el.dateFrom.value; renderTable(); });
    el.dateTo.addEventListener("change", () => { state.dateTo = el.dateTo.value; renderTable(); });
    el.clearFilters.addEventListener("click", () => {
      state.status = state.dateFrom = state.dateTo = "";
      el.statusFilter.value = el.dateFrom.value = el.dateTo.value = "";
      renderTable();
    });
    el.categoryRow.addEventListener("click", (event) => {
      const chip = event.target.closest(".chip");
      if (!chip) return;
      state.category = chip.dataset.category;
      el.categoryRow.querySelectorAll(".chip").forEach((button) => button.classList.toggle("active", button === chip));
      renderTable();
    });

    el.recordForm.addEventListener("submit", submitRecord);
    document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeRecordModal));
    el.recordModal.addEventListener("click", (event) => { if (event.target === el.recordModal) closeRecordModal(); });

    el.tableBody.addEventListener("click", (event) => {
      if (event.target.closest("[data-empty-add]")) {
        openRecordModal();
        return;
      }
      const button = event.target.closest("[data-row-action]");
      if (!button) return;
      const record = state.records[state.page].find((item) => item.id === button.dataset.id);
      if (!record) return;
      const action = button.dataset.rowAction;
      if (action === "edit") openRecordModal(record);
      if (action === "more") openMoreMenu(button, record.id);
      if (action === "details") showToast(`${record.productName} 的计划详情已载入`, "info");
      if (action === "favorite") {
        record.favorite = !record.favorite;
        saveRecords(state.page);
        renderTable();
        showToast(record.favorite ? "采购计划已收藏" : "已取消收藏");
      }
    });

    document.addEventListener("click", (event) => {
      const menuAction = event.target.closest("[data-menu-action]");
      if (menuAction) {
        requestConfirmation(menuAction.dataset.menuAction, menuAction.dataset.id);
        return;
      }
      if (!event.target.closest("#activeActionMenu") && !event.target.closest('[data-row-action="more"]')) closeActionMenu();
      const toastButton = event.target.closest("[data-toast]");
      if (toastButton) {
        showToast(toastButton.dataset.toast, "info");
        el.accountPopover.hidden = true;
        el.userMenu.setAttribute("aria-expanded", "false");
      }
    });

    el.cancelConfirm.addEventListener("click", () => { el.confirmPopover.hidden = true; state.confirmAction = null; });
    el.acceptConfirm.addEventListener("click", () => {
      if (state.confirmAction?.type === "reset") {
        handleResetConfirmation();
        el.confirmPopover.hidden = true;
        state.confirmAction = null;
      } else acceptConfirmation();
    });

    el.userMenu.addEventListener("click", () => {
      const expanded = el.userMenu.getAttribute("aria-expanded") === "true";
      el.userMenu.setAttribute("aria-expanded", String(!expanded));
      el.accountPopover.hidden = expanded;
    });

    el.procurementSwitcher.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-procurement-type]");
      if (!button) return;
      if (button.dataset.procurementType === "emergency") {
        showToast("当前暂无应急采购计划", "info");
        return;
      }
      el.procurementSwitcher.querySelectorAll("button").forEach((item) => item.classList.toggle("selected", item === button));
    });

    el.qualitySwitcher.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-quality-type]");
      if (!button) return;
      if (button.dataset.qualityType === "report") {
        showToast("当前暂无可查看的产品检测报告", "info");
        return;
      }
      el.qualitySwitcher.querySelectorAll("button").forEach((item) => item.classList.toggle("selected", item === button));
      el.workspaceCard.hidden = false;
      renderTable();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!el.recordModal.hidden) closeRecordModal();
      else if (!el.confirmPopover.hidden) { el.confirmPopover.hidden = true; state.confirmAction = null; }
      else if (!el.accountPopover.hidden) { el.accountPopover.hidden = true; el.userMenu.setAttribute("aria-expanded", "false"); }
    });
  }

  function init() {
    Object.keys(pages).forEach((page) => { state.records[page] = loadRecords(page); });
    bindEvents();
    setPage("operations");
  }

  init();
})();
