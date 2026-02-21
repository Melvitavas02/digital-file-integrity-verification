let originalHash = localStorage.getItem("savedHash") || "";
async function generateHash() {

    const fileInput = document.getElementById("fileInput");
    const resultDiv = document.getElementById("result");

    if (!fileInput.files.length) {
        resultDiv.innerHTML = "⚠️ Please select a file.";
        return;
    }

    const file = fileInput.files[0];
    const arrayBuffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
       originalHash = hashHex;
localStorage.setItem("savedHash", hashHex);

   resultDiv.innerHTML = `
    <p><strong>File Name:</strong> ${file.name}</p>
    <p><strong>File Size:</strong> ${(file.size/1024).toFixed(2)} KB</p>
    <p><strong>SHA-256 Hash:</strong></p>
   <div class="hash-box">
    <textarea id="hashValue">${hashHex}</textarea>
</div>
    <br>
    <button onclick="copyHash()">Copy Hash</button>
`;
}
function copyHash() {
    const hashText = document.getElementById("hashValue");
    hashText.select();
    document.execCommand("copy");
    alert("Hash copied to clipboard!");
}
async function verifyFile() {

    const fileInput = document.getElementById("fileInput");
    const resultDiv = document.getElementById("result");

    if (!fileInput.files.length || !originalHash) {
        resultDiv.innerHTML =
            "⚠️ Generate original hash first before verification.";
        return;
    }

    const file = fileInput.files[0];
    const arrayBuffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const newHash = hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

    if (newHash === originalHash) {
      resultDiv.innerHTML =
`<div class="result">
<span class="badge safe">INTEGRITY VERIFIED</span>
<p>✅ No changes detected.</p>
</div>`;  resultDiv.innerHTML =
    "<p class='safe'>✅ File Integrity Verified — No changes detected.</p>";
    } else {
       resultDiv.innerHTML =
`<div class="result">
<span class="badge danger">TAMPERING DETECTED</span>
<p>⚠️ File has been modified.</p>
</div>`;
    }
}
window.onload = function () {
    if (originalHash) {
        document.getElementById("result").innerHTML =
            "✅ Previous reference hash loaded. Ready for verification.";
    }
};