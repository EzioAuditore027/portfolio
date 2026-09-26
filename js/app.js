/**
 * Dark Futuristic AI Specialist Portfolio Engine
 * Himanshu Satish Shelke - IISER Thiruvananthapuram
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectFiltering();
  initCurriculumAccordions();
  initProjectModal();
  initSmoothScroll();
});

// Project Data with Detailed Mathematical & Architectural Protocols
const projectDetails = {
  hft_orderbook: {
    badge: "Quantitative Microstructure & High-Frequency Alpha",
    title: "High-Frequency Limit Order Book Predictive Modeling",
    subtitle: "Cross-Asset Momentum Arbitrage via Empirical Copulas & The Lead-Lag Effect",
    description: `An end-to-end quantitative research pipeline designed to predict tick-level directional price movements in cryptocurrency markets. Ingests raw high-frequency <code>aggTrades</code> data directly from Binance Vision (>1.5M rows/asset/day) to model structural market momentum.<br><br>
    The core alpha exploits the <strong>Lead-Lag Effect</strong> between Bitcoin (BTC) and Ethereum (ETH). By utilizing Bitcoin's Trade Flow Imbalance (TFI) as a leading micro-structural indicator, the LightGBM classifier successfully identifies cross-asset momentum arbitrage opportunities for Ethereum with deterministic, out-of-sample ground-truth validation.`,
    metrics: [
      { label: "Out-of-Sample Ticks", value: "~298,000" },
      { label: "Weighted Accuracy", value: "50.54%" },
      { label: "Weighted F1-Score", value: "0.5011" },
      { label: "Data Pipeline", value: "Rust-backed Polars" }
    ],
    mathFormula: `TFI_{\\tau} = \\sum_{t \\in \\tau} \\text{Sign}(v_t) \\cdot v_t, \\quad \\Delta P_{t+h}^{ETH} = f\\left(TFI_{\\tau}^{BTC}, \\, TFI_{\\tau}^{ETH}, \\, \\Delta P_{\\tau}^{BTC}\\right)`,
    codeSnippet: `# Extract & Transform Pipeline via Polars & ASOF Temporal Alignment
import polars as pl
import lightgbm as lgb

# Compute Trade Flow Imbalance rolling window without saturating memory
df_btc = df_btc.with_columns([
    (pl.col("is_buyer_maker").map_elements(lambda x: -1 if x else 1) * pl.col("quantity"))
    .alias("signed_volume")
])

df_btc = df_btc.with_columns([
    pl.col("signed_volume").rolling_sum(window_size=1000).alias("TFI_1000"),
    pl.col("signed_volume").rolling_sum(window_size=5000).alias("TFI_5000")
])

# Temporal backward-looking join_asof to align asynchronous ETH ticks with BTC state
aligned_df = df_eth.join_asof(
    df_btc.select(["timestamp", "TFI_1000", "TFI_5000"]),
    on="timestamp",
    strategy="backward"
)`,
    repoUrl: "https://github.com/EzioAuditore027"
  },

  multivariate_risk: {
    badge: "Econometric & Extreme Value Theory Engine",
    title: "Multivariate Risk Engine: GARCH-EVT & Vine Copulas",
    subtitle: "Non-Linear Tail Dependence & Rockafellar-Uryasev Min-CVaR Optimization",
    description: `A robust quantitative risk management framework designed for volatile equity portfolios.<br><br>
    <strong>Phase 1: GJR-GARCH Marginal Filtration</strong>: Captures asymmetric leverage effects and conditional heteroscedasticity. Heavy tail risks are modeled explicitly using Peaks Over Threshold (POT) Generalized Pareto Distribution (GPD) on extreme upper and lower 10% residuals.<br><br>
    <strong>Phase 2: R-Vine Copula Structure Selection</strong>: Captures complex non-linear tail dependency structures that traditional Gaussian correlation matrices miss.<br><br>
    <strong>Phase 3: Linear Programming for Min-CVaR</strong>: Implements the Rockafellar & Uryasev linear programming formulation in R to minimize 95% Expected Shortfall (CVaR) with exact budget constraints.`,
    metrics: [
      { label: "Tail Residual Threshold", value: "Top/Bottom 10%" },
      { label: "Simulated Scenarios", value: "10,000" },
      { label: "Confidence Alpha", value: "95% CVaR" },
      { label: "LP Engine", value: "Rglpk Exact" }
    ],
    mathFormula: `\\min_{\\gamma, \\mathbf{w}, \\mathbf{z}} \\left( \\gamma + \\frac{1}{(1 - \\alpha) S} \\sum_{s=1}^S z_s \\right) \\quad \\text{s.t.} \\quad \\mathbf{r}_s^T \\mathbf{w} + \\gamma + z_s \\ge 0, \\; \\sum_{j=1}^J w_j = 1`,
    codeSnippet: `# Min-CVaR Linear Programming formulation in R (Rglpk)
library(Rglpk)

alpha <- 0.95
S <- nrow(sim_returns); J <- ncol(sim_returns)

# Decision Vector: [w_1 ... w_J, gamma, z_1 ... z_S]
obj_coeffs <- c(rep(0, J), 1, rep(1 / ((1 - alpha) * S), S))

# Constraint 1: Scenarios (Returns * w + gamma + z_s >= 0)
mat_scenarios <- cbind(sim_returns, 1, diag(S))

# Constraint 2: Budget constraint (sum(w) == 1)
mat_budget <- c(rep(1, J), 0, rep(0, S))

# Solve Linear Program
res <- Rglpk_solve_LP(
  obj = obj_coeffs,
  mat = rbind(mat_scenarios, mat_budget),
  dir = c(rep(">=", S), "=="),
  rhs = c(rep(0, S), 1),
  max = FALSE
)`,
    repoUrl: "https://github.com/EzioAuditore027"
  },

  compact_svd: {
    badge: "Numerical Linear Algebra & Dimensional Reduction",
    title: "High-Dimensional Matrix Reconstruction via Compact SVD",
    subtitle: "Rigorous Numerical Factorization from First Principles",
    description: `Engineered explicit Compact Singular Value Decomposition protocols entirely from scratch, bypassing black-box truncated SVD libraries to ensure mathematically rigorous handling of highly correlated, high-dimensional datasets.<br><br>
    The algorithm strictly isolates and zeroes out negligible eigenvalues to preserve underlying topological invariants, preventing structural rank corruption and numerical drift during severe data compression.`,
    metrics: [
      { label: "Implementation", value: "Scratch NumPy" },
      { label: "Collinearity Handling", value: "Topological Rank" },
      { label: "Spectral Truncation", value: "Eigenvalue Isolation" },
      { label: "Language", value: "Python 3.10+" }
    ],
    mathFormula: `A = U_r \\Sigma_r V_r^T = \\sum_{i=1}^r \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T, \\quad \\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge \\sigma_r > 0`,
    codeSnippet: `# First-Principles Compact SVD Protocol
import numpy as np

def compact_svd(A, tol=1e-10):
    # Compute A^T A for right singular vectors
    AtA = np.dot(A.T, A)
    eigenvalues, V = np.linalg.eigh(AtA)
    
    # Sort in descending order
    idx = np.argsort(eigenvalues)[::-1]
    eigenvalues, V = eigenvalues[idx], V[:, idx]
    
    # Strict numerical threshold to preserve true rank
    pos_mask = eigenvalues > tol
    r = np.sum(pos_mask)
    
    singular_values = np.sqrt(eigenvalues[pos_mask])
    V_r = V[:, :r]
    
    # Compute left singular vectors: u_i = (1 / sigma_i) * A * v_i
    U_r = np.dot(A, V_r) / singular_values
    
    return U_r, np.diag(singular_values), V_r.T`,
    repoUrl: "https://github.com/EzioAuditore027"
  },

  edge_pruning: {
    badge: "Hardware-Constrained Machine Learning",
    title: "Edge Intelligence & Feature Space Pruning",
    subtitle: "L1 Regularization & Correlation Filtering for Constrained Microcontrollers",
    description: `Designed and optimized an inference pipeline tailored specifically for execution on resource-constrained embedded microcontrollers and edge hardware with strict power and memory budgets.<br><br>
    Applied aggressive feature space pruning combining L1-norm sparsity penalties with pairwise correlation elimination. The framework mathematically accepted a negligible 2% reduction in absolute predictive accuracy in exchange for a massive reduction in RAM consumption and sub-millisecond deterministic latency.`,
    metrics: [
      { label: "Accuracy Tradeoff", value: "Marginal ~2%" },
      { label: "Inference Latency", value: "< 1ms Deterministic" },
      { label: "Target Hardware", value: "Constrained MCU" },
      { label: "Methodology", value: "L1 Lasso + Correlation" }
    ],
    mathFormula: `\\min_{\\mathbf{\\beta}} \\left( \\frac{1}{2n} \\|\\mathbf{y} - \\mathbf{X}\\mathbf{\\beta}\\|_2^2 + \\lambda \\|\\mathbf{\\beta}\\|_1 \\right) \\quad \\text{s.t.} \\quad \\text{Corr}(X_i, X_j) < \\rho_{\\text{max}}`,
    codeSnippet: `# Hardware-Constrained Sparsity & Pruning
from sklearn.linear_model import LassoCV
import numpy as np

def prune_edge_features(X, y, corr_threshold=0.85):
    # Step 1: Filter highly correlated collinear channels
    corr_matrix = np.corrcoef(X.T)
    to_drop = set()
    for i in range(len(corr_matrix)):
        for j in range(i + 1, len(corr_matrix)):
            if abs(corr_matrix[i, j]) > corr_threshold:
                to_drop.add(j)
    
    kept_indices = [k for k in range(X.shape[1]) if k not in to_drop]
    X_reduced = X[:, kept_indices]
    
    # Step 2: L1 regularized sparsity induction
    lasso = LassoCV(cv=5).fit(X_reduced, y)
    sparse_mask = np.abs(lasso.coef_) > 1e-4
    
    return X_reduced[:, sparse_mask]`,
    repoUrl: "https://github.com/EzioAuditore027"
  },

  continuous_ppo: {
    badge: "Continuous Control & Reinforcement Learning",
    title: "Stochastic Continuous Environments & PPO",
    subtitle: "Proximal Policy Optimization with Custom Conjugate Gradient State Updates",
    description: `Implemented continuous-action Proximal Policy Optimization (PPO) in a custom PyTorch environment to mathematically stabilize extreme variance in volatile high-dimensional continuous spaces.<br><br>
    Bypassed standard black-box PyTorch optimizers to explicitly formulate and implement a custom Conjugate Gradient descent solver, guaranteeing second-order curvature approximations and maximum computational efficiency during policy network updates.`,
    metrics: [
      { label: "Framework", value: "PyTorch Deep RL" },
      { label: "Action Space", value: "Continuous Volatile" },
      { label: "Optimizer", value: "Conjugate Gradient" },
      { label: "Loss Function", value: "Clipped PPO" }
    ],
    mathFormula: `L^{CLIP}(\\theta) = \\hat{\\mathbb{E}}_t \\left[ \\min\\left( r_t(\\theta)\\hat{A}_t, \\, \\text{clip}(r_t(\\theta), 1-\\epsilon, 1+\\epsilon)\\hat{A}_t \\right) \\right]`,
    codeSnippet: `# Custom Conjugate Gradient step for natural policy updates
import torch

def conjugate_gradient(Avp_func, b, nsteps=10, residual_tol=1e-10):
    x = torch.zeros_like(b)
    r = b.clone()
    p = b.clone()
    rdotr = torch.dot(r, r)
    
    for _ in range(nsteps):
        Avp = Avp_func(p)
        alpha = rdotr / (torch.dot(p, Avp) + 1e-8)
        x += alpha * p
        r -= alpha * Avp
        new_rdotr = torch.dot(r, r)
        if new_rdotr < residual_tol:
            break
        beta = new_rdotr / rdotr
        p = r + beta * p
        rdotr = new_rdotr
    return x`,
    repoUrl: "https://github.com/EzioAuditore027"
  },

  parallel_openmp: {
    badge: "High-Performance Computing & Concurrency",
    title: "High-Performance Parallel Computing & Thread Scheduling",
    subtitle: "Shared & Distributed Memory Scientific Acceleration (OpenMP & C)",
    description: `Engineered high-performance numerical routines in C utilizing OpenMP multi-threaded primitives, dynamic and guided workload scheduling, barrier synchronizations, and fine-grained data scoping (<code>firstprivate</code>, shared memory) to bypass standard sequential overheads.<br><br>
    Evaluated speedup scaling factors against Amdahl's Law and analyzed cache-line invalidation bottlenecks across multi-core systems.`,
    metrics: [
      { label: "Language", value: "C99 / C++" },
      { label: "Parallel API", value: "OpenMP Directives" },
      { label: "Scheduling", value: "Dynamic / Guided" },
      { label: "Memory Model", value: "Shared Scoping" }
    ],
    mathFormula: `S(p) = \\frac{1}{(1 - f) + \\frac{f}{p}} \\le \\frac{1}{1 - f} \\quad (\\text{Amdahl's Scalability Law})`,
    codeSnippet: `// Parallel Task Scheduling & Firstprivate Scoping in C with OpenMP
#include <stdio.h>
#include <omp.h>

void execute_parallel_work(int total_tasks, double *data) {
    int shared_checksum = 0;
    
    #pragma omp parallel default(none) shared(data, total_tasks, shared_checksum)
    {
        int thread_id = omp_get_thread_num();
        int local_ops = 0;
        
        #pragma omp for schedule(dynamic, 64) nowait
        for (int i = 0; i < total_tasks; i++) {
            data[i] = data[i] * 1.05 + (double)thread_id;
            local_ops++;
        }
        
        #pragma omp atomic
        shared_checksum += local_ops;
    }
}`,
    repoUrl: "https://github.com/EzioAuditore027"
  }
};

// Project Filter Functionality
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.tab-cyber-btn');
  const projectCards = document.querySelectorAll('.cyber-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

// Curriculum Accordion Functionality
function initCurriculumAccordions() {
  const nodeCards = document.querySelectorAll('.neural-node-card');

  nodeCards.forEach(card => {
    const header = card.querySelector('.node-trigger-header');
    header.addEventListener('click', () => {
      card.classList.toggle('open');
    });
  });

  // Open first two nodes by default
  if (nodeCards.length > 0) nodeCards[0].classList.add('open');
  if (nodeCards.length > 1) nodeCards[1].classList.add('open');
}

// Modal Protocol Inspector
function initProjectModal() {
  const modalOverlay = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const inspectBtns = document.querySelectorAll('.inspect-protocol-btn');

  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalMetrics = document.getElementById('modalMetrics');
  const modalMath = document.getElementById('modalMath');
  const modalCode = document.getElementById('modalCode');
  const modalRepoBtn = document.getElementById('modalRepoBtn');

  inspectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectDetails[projectId];
      if (!data) return;

      modalBadge.textContent = data.badge;
      modalTitle.textContent = data.title;
      modalSubtitle.textContent = data.subtitle;
      modalDescription.innerHTML = data.description;
      modalMath.textContent = data.mathFormula;
      modalCode.textContent = data.codeSnippet;
      modalRepoBtn.setAttribute('href', data.repoUrl);

      // Render metrics with dark cyber styling
      modalMetrics.innerHTML = data.metrics.map(m => `
        <div style="background: rgba(8, 13, 21, 0.9); border: 1px solid rgba(56, 189, 248, 0.25); padding: 0.8rem 1rem; border-radius: 6px;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.25rem; font-weight: 700; color: #00F2FE;">${m.value}</div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #8493A8; text-transform: uppercase;">${m.label}</div>
        </div>
      `).join('');

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Re-trigger KaTeX rendering for dynamic math content
      if (window.renderMathInElement) {
        renderMathInElement(modalMath, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ]
        });
      }
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

// Smooth Scrolling for Navigation
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
