using LaplaceRedux
using Test

@testset "LaplaceRedux.jl" begin
    @testset "Curvature" begin
        include("curvature.jl")
    end

    @testset "Laplace" begin
        include("laplace.jl")
    end
end
