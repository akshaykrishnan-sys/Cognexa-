import numpy as np, soundfile as sf
SR=48000; BPM=120; B=60/BPM; T=27.0; N=int(SR*T)
rng=np.random.default_rng(7)
L=np.zeros(N); R=np.zeros(N)
def add(sig,t,gain=1.0,pan=0.0):
    i=int(t*SR); j=min(N,i+len(sig));
    if i>=N: return
    s=sig[:j-i]*gain; L[i:j]+=s*(1-max(0,pan)); R[i:j]+=s*(1+min(0,pan))
def env(n,a=.002,d=.2):
    t=np.arange(n)/SR; e=np.minimum(1,t/a)*np.exp(-t/d); return e
def lp(x,c):  # one-pole low-pass
    y=np.zeros_like(x); a=np.exp(-2*np.pi*c/SR); s=0
    for i in range(len(x)): s=(1-a)*x[i]+a*s; y[i]=s
    return y
def hp(x,c): return x-lp(x,c)
def kick():
    n=int(.45*SR); t=np.arange(n)/SR; f=45+110*np.exp(-t*28); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*env(n,.001,.22)*1.0 + np.tanh(6*np.sin(ph))*env(n,.001,.03)*.25
def clap():
    n=int(.3*SR); x=rng.standard_normal(n); x=hp(lp(x,3200),900)
    e=np.zeros(n)
    for k in (0,.011,.022): i=int(k*SR); e[i:]+=env(n-i,.001,.09 if k==.022 else .012)
    return x*e*.9
def hat(open_=False):
    n=int((.25 if open_ else .06)*SR); x=hp(rng.standard_normal(n),7000); return x*env(n,.0005,.12 if open_ else .018)*.35
def saw(f,n): t=np.arange(n)/SR; return 2*((t*f)%1)-1
def note(m): return 440*2**((m-69)/12)
# chords (A minor feel, uplifting): Am  F  C  G   (root midi for bass)
PROG=[(45,[57,60,64]),(41,[53,57,60]),(48,[55,60,64]),(43,[55,59,62])]
bars=int(T/(4*B))+1
for bar in range(bars):
    t0=bar*4*B; root,ch=PROG[bar%4]
    intro = t0 < 3.9                       # first two bars: lighter
    for beat in range(4):
        tb=t0+beat*B
        if tb>=T-1.8: break
        if not intro or beat in (0,2): add(kick(),tb,.95)
        if beat in (1,3) and not intro: add(clap(),tb,.55,.1)
        for h in range(4):
            th=tb+h*B/4
            if not intro or h==2: add(hat(open_=(h==2)),th,.5 if h==2 else .35,-.3+.6*(h%2))
        # bass on off-beats (pumping)
        n=int(B*.45*SR); bs=lp(saw(note(root),n)+.5*saw(note(root)*1.005,n),900)*env(n,.005,.18)
        if not intro: add(bs,tb+B/2,.55)
    # chord stabs every bar on beat 1 and the "and" of 3, plus a soft pad
    n=int(B*.4*SR); st=sum(lp(saw(note(m),n)+saw(note(m)*1.004,n),2400) for m in ch)*env(n,.003,.14)
    add(st,t0,.16,.25); add(st,t0+2.5*B,.12,-.25)
    n2=int(4*B*SR); pad=sum(lp(saw(note(m+12),n2)*.5+saw(note(m+12)*.997,n2)*.5,1400) for m in ch)
    pe=np.minimum(1,np.arange(n2)/(SR*.4))*np.minimum(1,(n2-np.arange(n2))/(SR*.3)); add(pad*pe,t0,.05)
# risers into each section and impacts on the big cuts
for tc in (4.0,8.0,10.0,14.0,18.0,20.5):
    n=int(1.2*SR); x=hp(rng.standard_normal(n),400); x=x*np.linspace(0,1,n)**2.5; add(x,tc-1.2,.12)
    n=int(1.0*SR); t=np.arange(n)/SR; boom=np.sin(2*np.pi*np.cumsum(40+60*np.exp(-t*12))/SR)*env(n,.001,.5); add(boom,tc,.6); add(hp(rng.standard_normal(int(.4*SR)),2000)*env(int(.4*SR),.001,.12),tc,.2)
# final hit and tail on the logo
n=int(3*SR); t=np.arange(n)/SR; tail=sum(np.sin(2*np.pi*note(m+12)*t) for m in [57,60,64,69])*np.exp(-t*1.1)*.08; add(tail,23.5); add(kick(),23.5,1.0)
# sidechain everything except kick by a kick-shaped duck
duck=np.ones(N)
for k in np.arange(0,T,B):
    i=int(k*SR); n=int(.22*SR); j=min(N,i+n); duck[i:j]=np.minimum(duck[i:j],1-.55*np.exp(-np.arange(j-i)/(SR*.07)))
L*=duck*0+1; R*=1
mix=np.stack([L,R],1); mix=np.tanh(mix*1.4)/np.tanh(1.4)
fade=np.ones(N); fl=int(1.2*SR); fade[-fl:]=np.linspace(1,0,fl); mix*=fade[:,None]
mix/=np.max(np.abs(mix))*1.12
sf.write('music.wav',mix.astype(np.float32),SR); print('music ok', mix.shape[0]/SR)
