/**
 * Dark Futuristic AI Specialist Portfolio Engine
 * Himanshu Satish Shelke - IISER Thiruvananthapuram
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectFiltering();
  initCurriculumAccordions();
  initProjectModal();
  initSmoothScroll();
  initMobileMenu();
  initButtonRipples();
  initMagneticButtons();
  initThemeToggle();
});

// Project Data with Detailed Mathematical & Architectural Protocols
const projectDetails = {
  hft_orderbook: {
    badge: "Quantitative Microstructure & High-Frequency Alpha",
    title: "High-Frequency Limit Order Book Predictive Modeling",
    subtitle: "Cross-Asset Momentum Arbitrage via Empirical Copulas & The Lead-Lag Effect",
    description: `Predicting price direction at the tick level is notoriously difficult because order books are noisy and execution latency is real. In this project, I tested whether aggressive buy/sell imbalances in Bitcoin provide early directional signal for Ethereum.<br><br>
    I processed raw tick-by-tick trades from Binance Vision—roughly 1.5 million rows per asset daily. To avoid memory bottlenecks, I used Polars instead of pandas, computing rolling Trade Flow Imbalance (TFI) windows and aligning the asynchronous timestamp streams with backward <code>join_asof</code> so no future information leaked into the features. The resulting LightGBM model captured a measurable lead-lag edge on out-of-sample data.`,
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
    description: `Standard portfolio theory assumes normal distributions and linear correlation. During severe market selloffs, both assumptions break down completely—correlations spike, and asset losses cluster in the tails.<br><br>
    To build a more realistic risk engine, I decomposed the problem into three stages:<br>
    1. <strong>GJR-GARCH + EVT:</strong> Filtered out volatility clustering and fit Generalized Pareto Distributions to the extreme 10% residual tails.<br>
    2. <strong>R-Vine Copulas:</strong> Modeled pairwise asymmetric dependence trees across assets without forcing a joint Gaussian copula.<br>
    3. <strong>Min-CVaR Optimization:</strong> Simulated 10,000 market scenarios and solved an exact Rockafellar-Uryasev linear program using <code>Rglpk</code> to allocate portfolio weights that minimize 95% Expected Shortfall.`,
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
    description: `Most data science workflows treat SVD as a one-liner call. But in rank-deficient problems or highly collinear data, default numerical solvers can retain small numerical artifacts that corrupt low-rank approximations.<br><br>
    I wrote a Compact SVD implementation from scratch in NumPy using basic linear algebra primitives ($A^T A$ eigendecomposition). The solver explicitly cuts off eigenvalues below a strict tolerance threshold, retaining only the $r$ true non-zero singular components. This preserves the geometric structure of the subspace while keeping memory and floating-point errors under control.`,
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
    description: `Running machine learning models on low-power microcontrollers forces tough engineering trade-offs: SRAM is tiny, and battery life is limited. You cannot just throw a large random forest onto an ARM Cortex-M.<br><br>
    To tackle this, I built a two-stage pruning pipeline. First, I compute pairwise Pearson correlations and drop redundant channels above an 0.85 threshold. Second, I run five-fold cross-validated Lasso regression to force uninformative weights strictly to zero. The stripped-down model sacrificed less than 2% in predictive accuracy, but cut memory footprint by over 60% and achieved deterministic sub-millisecond execution.`,
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
    description: `First-order optimizers like Adam treat every parameter coordinate equally, which can cause erratic, destructive policy updates in continuous control tasks. Second-order natural policy methods fix this, but computing the full Fisher Information matrix is far too expensive.<br><br>
    In this project, I built a continuous-action PPO pipeline from scratch in PyTorch. Instead of forming and inverting the full Hessian, I implemented a matrix-free Conjugate Gradient solver that iteratively computes Fisher-vector products. This stabilizes policy updates across difficult continuous landscapes without blowing up the computational budget.`,
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
    description: `Writing parallel code is rarely as simple as adding a <code>#pragma omp parallel for</code>. False sharing, uneven iteration costs, and synchronization barriers can easily wipe out theoretical multicore gains.<br><br>
    I implemented numerical routines in C99 to profile thread scheduling strategies against Amdahl's Law. By testing static, dynamic (chunk size 64), and guided schedules, and managing variable scope carefully with <code>firstprivate</code> and atomic accumulators, I mapped where memory bus saturation and cache line invalidations cap practical parallel speedup on multicore processors.`,
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

      // Render Mathematical Formula with KaTeX
      if (window.katex) {
        try {
          katex.render(data.mathFormula, modalMath, {
            displayMode: true,
            throwOnError: false
          });
        } catch (err) {
          modalMath.textContent = data.mathFormula;
        }
      } else if (window.renderMathInElement) {
        modalMath.innerHTML = `$$${data.mathFormula}$$`;
        renderMathInElement(modalMath, {
          delimiters: [{ left: '$$', right: '$$', display: true }]
        });
      } else {
        modalMath.textContent = data.mathFormula;
      }

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

// Mobile Slide-out Menu Controller
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  if (!menuBtn || !drawer) return;

  const toggleMenu = () => {
    const isActive = drawer.classList.toggle('active');
    menuBtn.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  };

  const closeMenu = () => {
    drawer.classList.remove('active');
    menuBtn.classList.remove('active');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', toggleMenu);

  drawer.querySelectorAll('.mobile-nav-link, .mobile-nav-actions a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Synaptic Button Ripple Micro-Interaction
// Synaptic Button Ripple Micro-Interaction (Instant feedback on Desktop & Mobile)
function initButtonRipples() {
  const interactiveButtons = document.querySelectorAll('.btn-cyber, .tab-cyber-btn, .cyber-link-btn, .theme-toggle-btn');

  interactiveButtons.forEach(btn => {
    const handleRipple = (e) => {
      const rect = btn.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height) * 2;
      const radius = diameter / 2;

      const clientX = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX) || (rect.left + rect.width / 2);
      const clientY = (e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY) || (rect.top + rect.height / 2);

      const ripple = document.createElement('span');
      ripple.classList.add('synaptic-ripple');
      ripple.style.width = `${diameter}px`;
      ripple.style.height = `${diameter}px`;
      ripple.style.left = `${clientX - rect.left - radius}px`;
      ripple.style.top = `${clientY - rect.top - radius}px`;

      const existing = btn.querySelector('.synaptic-ripple');
      if (existing) existing.remove();

      btn.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 650);
    };

    btn.addEventListener('pointerdown', handleRipple);
  });
}

// Subtle Magnetic Hover Tilt for Primary Interactive Elements (Desktop)
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024) return;

  const magneticElements = document.querySelectorAll('.btn-cyber-primary, .brand-hud');

  magneticElements.forEach(elem => {
    let bounds;

    const onMouseEnter = () => {
      bounds = elem.getBoundingClientRect();
    };

    const onMouseMove = (e) => {
      if (!bounds) bounds = elem.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const deltaX = (mouseX - bounds.width / 2) * 0.18;
      const deltaY = (mouseY - bounds.height / 2) * 0.18;

      elem.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const onMouseLeave = () => {
      elem.style.transform = '';
      bounds = null;
    };

    elem.addEventListener('mouseenter', onMouseEnter);
    elem.addEventListener('mousemove', onMouseMove);
    elem.addEventListener('mouseleave', onMouseLeave);
  });
}

// Theme Mode Controller (Dark & Light)
function initThemeToggle() {
  const toggleButtons = document.querySelectorAll('.theme-toggle-btn, #themeToggleBtn, #mobileThemeToggleBtn');

  const getSavedTheme = () => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {}
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}

    // Update any mobile toggle button labels
    document.querySelectorAll('.mobile-theme-btn .theme-label-text').forEach(label => {
      label.textContent = theme === 'light' ? 'SWITCH_TO_DARK' : 'SWITCH_TO_LIGHT';
    });
  };

  const toggleTheme = (e) => {
    if (e) e.preventDefault();
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Apply initial theme state
  const initialTheme = getSavedTheme();
  setTheme(initialTheme);
}


