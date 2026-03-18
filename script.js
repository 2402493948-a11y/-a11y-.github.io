document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    
    // 监听计算按钮点击事件
    calculateBtn.addEventListener('click', function() {
        calculateRange();
    });
    
    // 监听输入变化，实时更新系数显示
    document.getElementById('temperature').addEventListener('change', updateFactors);
    document.getElementById('load').addEventListener('change', updateFactors);
    document.getElementById('road').addEventListener('change', updateFactors);
    document.getElementById('batteryType').addEventListener('change', updateFactors);
    document.getElementById('ridingStyle').addEventListener('change', updateFactors);
    document.getElementById('batteryAge').addEventListener('change', updateFactors);
    
    // 初始化更新系数显示
    updateFactors();
    
    // 计算续航函数
    function calculateRange() {
        // 获取电池参数
        const voltage = parseFloat(document.getElementById('batteryVoltage').value) || 0;
        const capacity = parseFloat(document.getElementById('batteryCapacity').value) || 0;
        const power = parseFloat(document.getElementById('motorPower').value) || 0;
        const speed = parseFloat(document.getElementById('speed').value) || 0;
        
        // 参数边界检查
        if (voltage < 24 || voltage > 120) {
            alert('电池电压应在24V-120V之间');
            return;
        }
        if (capacity < 5 || capacity > 100) {
            alert('电池容量应在5Ah-100Ah之间');
            return;
        }
        if (power < 200 || power > 5000) {
            alert('电机功率应在200W-5000W之间');
            return;
        }
        if (speed < 5 || speed > 120) {
            alert('行驶速度应在5km/h-120km/h之间');
            return;
        }
        
        // 计算理论续航（考虑速度对能耗的影响）
        let theoreticalRange = 0;
        if (power > 0 && speed > 0) {
            // 基础续航计算（基于标准速度30km/h）
            const baseRange = (voltage * capacity * 30) / power;
            
            // 速度因子：速度越快，风阻越大，续航减少
            // 低速时续航增加，高速时续航减少
            let speedFactor = 1;
            if (speed < 30) {
                // 低于30km/h时，续航增加
                speedFactor = 1 + (30 - speed) * 0.01;
            } else {
                // 高于30km/h时，续航减少
                speedFactor = 1 / (1 + (speed - 30) * 0.02);
            }
            
            theoreticalRange = baseRange * speedFactor;
        }
        
        // 获取修正系数
        const tempFactor = parseFloat(document.getElementById('temperature').value) || 1;
        const loadFactor = parseFloat(document.getElementById('load').value) || 1;
        const roadFactor = parseFloat(document.getElementById('road').value) || 1;
        const batteryTypeFactor = parseFloat(document.getElementById('batteryType').value) || 1;
        const ridingStyleFactor = parseFloat(document.getElementById('ridingStyle').value) || 1;
        const batteryAgeFactor = parseFloat(document.getElementById('batteryAge').value) || 1;
        
        // 计算总修正系数
        const totalFactor = tempFactor * loadFactor * roadFactor * batteryTypeFactor * ridingStyleFactor * batteryAgeFactor;
        
        // 计算实际续航
        const actualRange = theoreticalRange * totalFactor;
        
        // 更新结果显示
        document.getElementById('theoreticalRange').textContent = theoreticalRange.toFixed(1) + ' 公里';
        document.getElementById('actualRange').textContent = actualRange.toFixed(1) + ' 公里';
        
        // 更新系数显示
        updateFactors();
    }
    
    // 更新系数显示函数
    function updateFactors() {
        const tempFactor = parseFloat(document.getElementById('temperature').value) || 1;
        const loadFactor = parseFloat(document.getElementById('load').value) || 1;
        const roadFactor = parseFloat(document.getElementById('road').value) || 1;
        const batteryTypeFactor = parseFloat(document.getElementById('batteryType').value) || 1;
        const ridingStyleFactor = parseFloat(document.getElementById('ridingStyle').value) || 1;
        const batteryAgeFactor = parseFloat(document.getElementById('batteryAge').value) || 1;
        
        // 计算总修正系数
        const totalFactor = tempFactor * loadFactor * roadFactor * batteryTypeFactor * ridingStyleFactor * batteryAgeFactor;
        
        // 更新系数显示
        document.getElementById('tempFactor').textContent = tempFactor.toFixed(2);
        document.getElementById('loadFactor').textContent = loadFactor.toFixed(2);
        document.getElementById('roadFactor').textContent = roadFactor.toFixed(2);
        document.getElementById('batteryTypeFactor').textContent = batteryTypeFactor.toFixed(2);
        document.getElementById('ridingStyleFactor').textContent = ridingStyleFactor.toFixed(2);
        document.getElementById('batteryAgeFactor').textContent = batteryAgeFactor.toFixed(2);
        document.getElementById('totalFactor').textContent = totalFactor.toFixed(3);
    }
    
    // 页面加载完成后自动计算一次
    calculateRange();
});