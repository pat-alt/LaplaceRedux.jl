var documenterSearchIndex = {"docs":
[{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"CurrentModule = BayesLaplace","category":"page"},{"location":"logit/#Bayesian-Logisitic-Regression","page":"Bayesian Logistic Regression","title":"Bayesian Logisitic Regression","text":"","category":"section"},{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"# Import libraries.\nusing Flux, Plots, Random, PlotThemes, Statistics, BayesLaplace\ntheme(:juno)","category":"page"},{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"We will use synthetic data with linearly separable samples:","category":"page"},{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"# Number of points to generate.\nxs, y = toy_data_linear(100)\nX = hcat(xs...); # bring into tabular format\ndata = zip(xs,y);","category":"page"},{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"Logisitic regression with weight decay can be implemented in Flux.jl as a single dense (linear) layer with binary logit crossentropy loss:","category":"page"},{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"nn = Chain(Dense(2,1))\nλ = 0.5\nsqnorm(x) = sum(abs2, x)\nweight_regularization(λ=λ) = 1/2 * λ^2 * sum(sqnorm, Flux.params(nn))\nloss(x, y) = Flux.Losses.logitbinarycrossentropy(nn(x), y) + weight_regularization()","category":"page"},{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"The code below simply trains the model. After about 50 training epochs training loss stagnates.","category":"page"},{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"using Flux.Optimise: update!, ADAM\nopt = ADAM()\nepochs = 50\navg_loss(data) = mean(map(d -> loss(d[1],d[2]), data))\n\nusing Plots\nanim = Animation()\nplt = plot(ylim=(0,avg_loss(data)), xlim=(0,epochs), legend=false, xlab=\"Epoch\")\navg_l = []\n\nfor epoch = 1:epochs\n  for d in data\n    gs = gradient(params(nn)) do\n      l = loss(d...)\n    end\n    update!(opt, params(nn), gs)\n  end\n  avg_l = vcat(avg_l,avg_loss(data))\n  plot!(plt, avg_l, color=1, title=\"Average (training) loss\")\n  frame(anim, plt)\nend\n\ngif(anim, \"www/nn_training.gif\");","category":"page"},{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"(Image: )","category":"page"},{"location":"logit/#Laplace-appoximation","page":"Bayesian Logistic Regression","title":"Laplace appoximation","text":"","category":"section"},{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"Laplace approximation for the posterior predictive can be implemented as follows:","category":"page"},{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"la = laplace(nn, λ=λ, subset_of_weights=:last_layer)\nfit!(la, data);\np_plugin = plot_contour(X',y,la;title=\"Plugin\",type=:plugin);\np_laplace = plot_contour(X',y,la;title=\"Laplace\");","category":"page"},{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"The plot below shows the resulting posterior predictive surface for the plugin estimator (left) and the Laplace approximation (right).","category":"page"},{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"# Plot the posterior distribution with a contour plot.\nplt = plot(p_plugin, p_laplace, layout=(1,2), size=(1000,400))\nsavefig(plt, \"www/posterior_predictive.png\")","category":"page"},{"location":"logit/","page":"Bayesian Logistic Regression","title":"Bayesian Logistic Regression","text":"(Image: )","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"CurrentModule = BayesLaplace","category":"page"},{"location":"mlp/#Bayesian-MLP","page":"Bayesian Neural Network","title":"Bayesian MLP","text":"","category":"section"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"# Import libraries.\nusing Flux, Plots, Random, PlotThemes, Statistics, BayesLaplace\ntheme(:juno)","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"This time we use a synthetic dataset containing samples that are not linearly separable:","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"# Number of points to generate.\nxs, y = toy_data_non_linear(200)\nX = hcat(xs...); # bring into tabular format\ndata = zip(xs,y);","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"For the classification task we build a neural network with weight decay composed of a single hidden layer.","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"n_hidden = 32\nD = size(X)[1]\nnn = Chain(\n    Dense(D, n_hidden, σ),\n    Dense(n_hidden, 1)\n)  \nλ = 0.01\nsqnorm(x) = sum(abs2, x)\nweight_regularization(λ=λ) = 1/2 * λ^2 * sum(sqnorm, Flux.params(nn))\nloss(x, y) = Flux.Losses.logitbinarycrossentropy(nn(x), y) + weight_regularization();","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"The model is trained for 200 epochs before the training loss stagnates.","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"using Flux.Optimise: update!, ADAM\nopt = ADAM()\nepochs = 200\navg_loss(data) = mean(map(d -> loss(d[1],d[2]), data))\n\nusing Plots\nanim = Animation()\nplt = plot(ylim=(0,avg_loss(data)), xlim=(0,epochs), legend=false, xlab=\"Epoch\")\navg_l = []\n\nfor epoch = 1:epochs\n  for d in data\n    gs = gradient(params(nn)) do\n      l = loss(d...)\n    end\n    update!(opt, params(nn), gs)\n  end\n  avg_l = vcat(avg_l,avg_loss(data))\n  plot!(plt, avg_l, color=1, title=\"Average (training) loss\")\n  frame(anim, plt)\nend\n\ngif(anim, \"www/nn_training_mlp.gif\");","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"(Image: )","category":"page"},{"location":"mlp/#Laplace-appoximation","page":"Bayesian Neural Network","title":"Laplace appoximation","text":"","category":"section"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"Laplace approximation can be implemented as follows:","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"la = laplace(nn, λ=λ, subset_of_weights=:last_layer)\nfit!(la, data);\nzoom=0\np_plugin = plot_contour(X',y,la;title=\"Plugin\",type=:plugin,zoom=zoom);\np_laplace = plot_contour(X',y,la;title=\"Laplace\",zoom=zoom);","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"The plot below shows the resulting posterior predictive surface for the plugin estimator (left) and the Laplace approximation (right).","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"# Plot the posterior distribution with a contour plot.\nplt = plot(p_plugin, p_laplace, layout=(1,2), size=(1000,400))\nsavefig(plt, \"www/posterior_predictive_mlp.png\")","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"(Image: )","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"Zooming out we can note that the plugin estimator produces high-confidence estimates in regions scarce of any samples. The Laplace approximation is much more conservative about these regions.","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"zoom=-50\np_plugin = plot_contour(X',y,la;title=\"Plugin\",type=:plugin,zoom=zoom);\np_laplace = plot_contour(X',y,la;title=\"Laplace\",zoom=zoom);\n# Plot the posterior distribution with a contour plot.\nplt = plot(p_plugin, p_laplace, layout=(1,2), size=(1000,400))\nsavefig(plt, \"www/posterior_predictive_mlp_zoomed.png\");","category":"page"},{"location":"mlp/","page":"Bayesian Neural Network","title":"Bayesian Neural Network","text":"(Image: )","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = BayesLaplace","category":"page"},{"location":"#BayesLaplace","page":"Home","title":"BayesLaplace","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for BayesLaplace.","category":"page"},{"location":"","page":"Home","title":"Home","text":"This is a small library that can be used for effortless Bayesian Deep Learning and Logisitic Regression trough Laplace Approximation. It is inspired by this Python library and its companion paper.","category":"page"},{"location":"#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This package is not registered, but can be installed from Github as follows:","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Pkg\nPkg.add(\"https://github.com/pat-alt/BayesLaplace.jl\")","category":"page"},{"location":"#Limitations","page":"Home","title":"Limitations","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This library is pure-play and lacks any kind of unit testing. It is also limited to binary classification problems. ","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [BayesLaplace]","category":"page"}]
}