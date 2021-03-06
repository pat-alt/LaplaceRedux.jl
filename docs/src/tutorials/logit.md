``` @meta
CurrentModule = LaplaceRedux
```

# Bayesian Logisitic Regression

We will use synthetic data with linearly separable samples:

``` julia
# Number of points to generate.
xs, ys = toy_data_linear(100)
X = hcat(xs...) # bring into tabular format
data = zip(xs,ys)
```

Logisitic regression with weight decay can be implemented in Flux.jl as a single dense (linear) layer with binary logit crossentropy loss:

``` julia
nn = Chain(Dense(2,1))
λ = 0.5
sqnorm(x) = sum(abs2, x)
weight_regularization(λ=λ) = 1/2 * λ^2 * sum(sqnorm, Flux.params(nn))
loss(x, y) = Flux.Losses.logitbinarycrossentropy(nn(x), y) + weight_regularization()
```

The code below simply trains the model. After about 50 training epochs training loss stagnates.

``` julia
using Flux.Optimise: update!, ADAM
opt = ADAM()
epochs = 50
avg_loss(data) = mean(map(d -> loss(d[1],d[2]), data))
show_every = epochs/10

for epoch = 1:epochs
  for d in data
    gs = gradient(params(nn)) do
      l = loss(d...)
    end
    update!(opt, params(nn), gs)
  end
  if epoch % show_every == 0
    println("Epoch " * string(epoch))
    @show avg_loss(data)
  end
end
```

## Laplace appoximation

Laplace approximation for the posterior predictive can be implemented as follows:

``` julia
la = Laplace(nn, λ=λ, subset_of_weights=:last_layer)
fit!(la, data)
```

The plot below shows the resulting posterior predictive surface for the plugin estimator (left) and the Laplace approximation (right).

![](www/posterior_predictive.png)
